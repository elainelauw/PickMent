import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonPage, IonRow, IonTitle, IonToolbar, NavContext } from '@ionic/react';
import { caretBack, close, createOutline } from 'ionicons/icons';
import { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';

import UserContext from '../data/user-context';

import './Profile.css';

const Profile: React.FC = () => {
  const userCtx = useContext(UserContext);

  const { navigate } = useContext(NavContext);

  const redirect = useCallback(
		() => navigate('/welcome'),
		[navigate]
	);

  const [username, setUsername] = useState("username");
  const [status, setStatus] = useState("0");
  const [level, setLevel] = useState(0);
  const [xp, setXp] = useState(0);
  const [requiredXp, setRequiredXp] = useState(1000);
  const [xpPercentage, setXpPercentage] = useState(0);
  const [avatar, setAvatar] = useState("Pemain.png");
  const [frame, setFrame] = useState("ffffffffffff");
  const [namecard, setNamecard] = useState("Pemain.jpg");
  const [badge1id, setBadge1id] = useState("0");
  const [badge1image, setBadge1image] = useState("");
  const [badge2id, setBadge2id] = useState("0");
  const [badge2image, setBadge2image] = useState("");

  const [newUsername, setNewUsername] = useState("");
  const [newBadge1, setNewBadge1] = useState("0");
  const [newBadge2, setNewBadge2] = useState("0");

  const [badges, setBadges] = useState<Array<any>>([]);

	useEffect(() => {
		if(userCtx.user.length === 0) {
      redirect();
    }
    else {
      if(userCtx.user[0].uid != -1) {
        const formData = new FormData();

        formData.append('uid', userCtx.user[0].uid.toString());

        axios.post("http://localhost/PickMent/getProfile.php", formData).then(res => {
          setUsername(res.data.profile[0].username);
          setStatus(res.data.profile[0].status);
          setLevel(parseInt(res.data.profile[0].level));
          setXp(parseInt(res.data.profile[0].xp));

          var x = parseInt(res.data.profile[0].level);
          var y = 1000  * Math.pow(2, x);

          setRequiredXp(y);
          
          if(parseInt(res.data.profile[0].xp) === 0) {
            setXpPercentage(0);
          }
          else {
            if(parseInt(res.data.profile[0].xp) > y) {
              setXpPercentage(100);
            }
            else {
              var m = parseInt(res.data.profile[0].xp);
              var o = m / y * 100;
  
              setXpPercentage(o);
            }
          }

          setAvatar(res.data.profile[0].avatarImage);
          setFrame(res.data.profile[0].frameColor);
          setNamecard(res.data.profile[0].namecardImage);
          setBadge1id(res.data.profile[0].badge1id);
          setBadge1image(res.data.profile[0].badge1image);
          setBadge2id(res.data.profile[0].badge2id);
          setBadge2image(res.data.profile[0].badge2image);

          setNewBadge1(res.data.profile[0].badge1id);
          setNewBadge2(res.data.profile[0].badge2id);
        });

        axios.post("http://localhost/PickMent/getBadges.php", formData).then(res => {
          setBadges(res.data.badges);
        });
      }
    }
	}, [userCtx]);

  const [isUsernameModalShown, setIsUsernameModalShown] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  async function editUsernameHandler() {
    if(newUsername === '') {
      return setErrorMessage('Nama Pengguna tidak boleh kosong.');
    }
    else {
      if(newUsername.length < 2 || newUsername.length > 10) {
        return setErrorMessage('Nama Pengguna harus terdiri dari minimal 2 karakter dan maksimal 10 karakter.');
      }
      else {
        if(!/^[a-zA-Z0-9]*$/.test(newUsername)) {
          return setErrorMessage('Nama Pengguna hanya boleh terdiri dari karakter huruf dan karakter angka.')
        }
        else {
          if(newUsername === username) {
            return setErrorMessage('Nama Pengguna baru sama dengan Nama Pengguna saat ini.');
          }
        }
      }
    }

    const formData = new FormData();

    formData.append('uid', userCtx.user[0].uid.toString());
    formData.append('username', newUsername);

    axios.post("http://localhost/PickMent/updateUsername.php", formData).then(res => {
      if(res.data.success === 1) {
        setUsername(newUsername);
        setIsUsernameModalShown(false);
      }
      else {
        setErrorMessage(res.data.message);
      }
    });
  }

  const [isBadgeModalShown, setIsBadgeModalShown] = useState(false);

  const selectBadgeHandler = (id: string) => {
		if(newBadge1 === "0") {
      setNewBadge1(id);
    }
    else {
      if(id === newBadge1) {
        if(newBadge2 === "0") {
          setNewBadge1("0");
        }
        else {
          setNewBadge1(newBadge2);
          setNewBadge2("0");
        }
      }
      else {
        if(newBadge2 === "0") {
          setNewBadge2(id);
        }
        else {
          if(id === newBadge2) {
            setNewBadge2("0");
          }
        }
      }
    }
	}

  async function editBadgeHandler() {
    const formData = new FormData();

    formData.append('uid', userCtx.user[0].uid.toString());
    formData.append('badge1', newBadge1);
    formData.append('badge2', newBadge2);

    axios.post("http://localhost/PickMent/updateProfileBadges.php", formData).then(res => {
      window.location.reload();
    });
  }

  async function logoutHandler() {
    userCtx.logout();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar class='toolbar-color-secondary'>
          <IonButtons slot='start'>
            <IonBackButton defaultHref='home' icon={caretBack}/>
          </IonButtons>

          <IonTitle slot='end' class='font-fredoka-one'>
            P I C K M E N T
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonModal
          isOpen={isUsernameModalShown}
          onDidDismiss={() => {setIsUsernameModalShown(false); setNewUsername(""); setErrorMessage("");}}
          class='profile-username-modal'
        >
          <IonHeader>
            <IonToolbar class='font-fredoka-one text-color-primary'>
              <IonButtons slot="start">
                <IonButton disabled={true}>
                  <IonIcon/>
                </IonButton>
              </IonButtons>

              <IonTitle class='ion-text-center'>
                Ubah Nama Pengguna
              </IonTitle>

              <IonButtons slot="end">
                <IonButton onClick={() => setIsUsernameModalShown(false)}>
                  <IonIcon icon={close}/>
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding">
            <IonItem lines='none'>
              <IonLabel position="stacked" class='profile-username-modal-label'>Nama Pengguna</IonLabel>
              <IonItem lines='none' class='input-primary'>
                <IonInput placeholder="Masukkan nama pengguna baru" type='text' value={newUsername} onIonChange={(e: any) => setNewUsername(e.target.value)}/>
              </IonItem>
              <small className='profile-username-modal-warning-text'>{errorMessage}</small>
            </IonItem>
          </IonContent>

          <IonFooter>
            <IonToolbar>
              <IonRow class='ion-padding'>
                <IonButton class='button-short-primary margin-lr-auto' onClick={editUsernameHandler}>Simpan</IonButton>
              </IonRow>
            </IonToolbar>
          </IonFooter>
        </IonModal>

        <IonModal
          isOpen={isBadgeModalShown}
          onDidDismiss={() => {setIsBadgeModalShown(false); setNewBadge1(badge1id); setNewBadge2(badge2id);}}
          class='profile-badge-modal'
        >
          <IonHeader>
            <IonToolbar class='font-fredoka-one text-color-primary'>
              <IonButtons slot="start">
                <IonButton disabled={true}>
                  <IonIcon/>
                </IonButton>
              </IonButtons>

              <IonTitle class='ion-text-center'>
                Ubah Medali Profil
              </IonTitle>

              <IonButtons slot="end">
                <IonButton onClick={() => setIsBadgeModalShown(false)}>
                  <IonIcon icon={close}/>
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding">
            <IonGrid>
              <IonRow>
                {badges && badges.length > 0 &&
                  badges.filter(b => b.status === "1").map(b => (
                    <IonCol size='3' class='ion-margin-bottom' key={b.id}>
                      <div className='profile-badge-modal-item-container' onClick={() => selectBadgeHandler(b.id)}>
                        <img src={'assets/badge/' + b.image} className={(b.id === newBadge1 || b.id === newBadge2)? 'profile-badge-modal-item-selected' : 'profile-badge-modal-item'}/>
                        {b.id === newBadge1 && <div className='profile-badge-modal-item-selected-label'>1</div>}
                        {b.id === newBadge2 && <div className='profile-badge-modal-item-selected-label'>2</div>}
                      </div>
                      <div className='profile-badge-modal-label'>{b.title}</div>
                    </IonCol>
                  ))
                }
              </IonRow>
            </IonGrid>
          </IonContent>

          <IonFooter>
            <IonToolbar>
              <IonRow class='ion-padding'>
                <IonButton class='button-short-primary margin-lr-auto' onClick={editBadgeHandler}>Simpan</IonButton>
              </IonRow>
            </IonToolbar>
          </IonFooter>
        </IonModal>
        
        <IonGrid>
          <IonRow class='ion-padding'>
            <IonCol
              class='profile-col-top ion-no-padding margin-lr-auto'
              style={{
                backgroundImage: "url(assets/namecard/" + namecard + ")",
                backgroundPosition: "0 100%",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
                backgroundSize: "cover",
                backgroundColor: "var(--pickment-color-secondary)"
              }}
            >
              <div className='profile-div-top'>
                <IonRow class='profile-avatar-row'>
                  <div
                    className='profile-avatar-div margin-lr-auto'
                    style={{
                      backgroundImage: "linear-gradient(#" + frame.substring(0, 6) + ", #" + frame.substring(6) + ")"
                    }}
                  >
                    <img src={'assets/avatar/' + avatar} className='profile-avatar-image'/>
                  </div>
                </IonRow>
              </div>

              <div className='profile-div-bottom'>
                <IonRow>
                  <div className='margin-lr-auto'>
                    <IonRow>
                      <h2 className='ion-no-margin'>{username}</h2>
                      <IonIcon icon={createOutline} class='profile-username-edit text-color-primary cursor-pointer' onClick={() => setIsUsernameModalShown(true)}/>
                    </IonRow>
                  </div>
                </IonRow>

                <IonRow class='ion-padding-top'>
                  <div className='margin-lr-auto'>
                    <IonRow>
                      {badge1id === "0"?
                        <div className='profile-badge-1'></div>
                      :
                        <img src={'assets/badge/' + badge1image} className='profile-badge-1'/>
                      }
                      {badge2id === "0"?
                        <div className='profile-badge-2'></div>
                      :
                        <img src={'assets/badge/' + badge2image} className='profile-badge-2'/>
                      }
                      <IonIcon icon={createOutline} class='profile-badge-edit text-color-primary cursor-pointer' onClick={() => setIsBadgeModalShown(true)}/>
                    </IonRow>
                  </div>
                </IonRow>
                
                <IonRow class='profile-level-row font-fredoka-one'>
                  <div className='profile-level-required-xp'>
                    <div
                      className='profile-level-current-xp'
                      style={{
                        minWidth: xp > 0? "20px" : "0",
                        width: xpPercentage + "%"
                      }}
                    />
                    <div className='profile-level-text'>Level {level}</div> 
                    <div className='profile-level-xp'>{xp}/{requiredXp} XP</div>
                  </div>
                </IonRow>
              </div>
            </IonCol>
          </IonRow>

          <IonRow class='ion-padding-top'>
            <IonCol>
              <IonRow>
                <IonButton href='\editProfile' class='margin-lr-auto button-long-primary'>
                  Ubah Profil
                </IonButton>
              </IonRow>

              <IonRow>
                <IonButton href='\editInfo' class='margin-lr-auto button-long-primary'>
                  Ubah Data Diri
                </IonButton>
              </IonRow>

              <IonRow>
                <IonButton href='\settings' class='margin-lr-auto button-long-primary'>
                  Pengaturan
                </IonButton>
              </IonRow>
            </IonCol>
          </IonRow>

          <IonRow class='ion-padding-top'>
            <IonCol>
              {status === "1" &&
                <>
                  <IonRow>
                    <IonButton href='\upload' class='margin-lr-auto button-long-primary'>
                      Unggah Set
                    </IonButton>
                  </IonRow>

                  <IonRow>
                    <IonButton href='\uploaded' class='margin-lr-auto button-long-primary'>
                      Daftar Set
                    </IonButton>
                  </IonRow>
                </>
              }

              <IonRow>
                <IonButton class='margin-lr-auto button-long-primary-outline' color='outline' onClick={logoutHandler}>Keluar</IonButton>
              </IonRow>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
