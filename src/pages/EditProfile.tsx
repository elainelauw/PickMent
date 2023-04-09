import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonItem, IonPage, IonRow, IonTitle, IonToolbar, NavContext } from '@ionic/react';
import { caretBack, checkmark, lockClosed } from 'ionicons/icons';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';

import UserContext from '../data/user-context';

import './EditProfile.css';

const EditProfile: React.FC = () => {
  const userCtx = useContext(UserContext);
  const history = useHistory();

  const { navigate } = useContext(NavContext);

  const redirect = useCallback(
		() => navigate('/welcome'),
		[navigate]
	);

  const [username, setUsername] = useState("username");
  const [avatarId, setAvatarId] = useState("1");
  const [avatarImage, setAvatarImage] = useState("Pemain.png");
  const [frameId, setFrameId] = useState("1");
  const [frameColor, setFrameColor] = useState("ffffffffffff");
  const [namecardId, setNamecardId] = useState("1");
  const [namecardImage, setNamecardImage] = useState("Pemain.jpg");
  const [badge1image, setBadge1image] = useState("");
  const [badge2image, setBadge2image] = useState("");
  
  const [newAvatarId, setNewAvatarId] = useState("1");
  const [newAvatarImage, setNewAvatarImage] = useState("Pemain.png");
  const [newFrameId, setNewFrameId] = useState("1");
  const [newFrameColor, setNewFrameColor] = useState("ffffffffffff");
  const [newNamecardId, setNewNamecardId] = useState("1");
  const [newNamecardImage, setNewNamecardImage] = useState("Pemain.jpg");

  const [avatars, setAvatars] = useState<Array<any>>([]);
  const [frames, setFrames] = useState<Array<any>>([]);
  const [namecards, setNamecards] = useState<Array<any>>([]);

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
          setAvatarId(res.data.profile[0].avatarId);
          setAvatarImage(res.data.profile[0].avatarImage);
          setFrameId(res.data.profile[0].frameId);
          setFrameColor(res.data.profile[0].frameColor);
          setNamecardId(res.data.profile[0].namecardId);
          setNamecardImage(res.data.profile[0].namecardImage);
          setBadge1image(res.data.profile[0].badge1image);
          setBadge2image(res.data.profile[0].badge2image);

          setNewAvatarId(res.data.profile[0].avatarId);
          setNewAvatarImage(res.data.profile[0].avatarImage);
          setNewFrameId(res.data.profile[0].frameId);
          setNewFrameColor(res.data.profile[0].frameColor);
          setNewNamecardId(res.data.profile[0].namecardId);
          setNewNamecardImage(res.data.profile[0].namecardImage);
        });

        axios.post("http://localhost/PickMent/getAvatars.php", formData).then(res => {
          setAvatars(res.data.avatars);
        });

        axios.post("http://localhost/PickMent/getFrames.php", formData).then(res => {
          setFrames(res.data.frames);
        });

        axios.post("http://localhost/PickMent/getNamecards.php", formData).then(res => {
          setNamecards(res.data.namecards);
        });
      }
    }
	}, [userCtx]);

  const editProfileHandler = () => {
		const formData = new FormData();

    formData.append('uid', userCtx.user[0].uid.toString());
    formData.append('avatar', newAvatarId);
    formData.append('frame', newFrameId);
    formData.append('namecard', newNamecardId);

    axios.post("http://localhost/PickMent/updateProfile.php", formData).then(res => {
      history.replace('/profile');
    });
	}

  const resetInputHandler = () => {
		setNewAvatarId(avatarId);
    setNewAvatarImage(avatarImage);
    setNewFrameId(frameId);
    setNewFrameColor(frameColor);
    setNewNamecardId(namecardId);
    setNewNamecardImage(namecardImage);
	}

  return (
    <IonPage>
      <IonHeader class='edit-profile-header'>
        <IonToolbar class='toolbar-color-secondary'>
          <IonButtons slot='start'>
            <IonBackButton defaultHref='profile' icon={caretBack}/>
          </IonButtons>

          <IonTitle slot='end' class='font-fredoka-one'>
            P I C K M E N T
          </IonTitle>
        </IonToolbar>

        <IonItem lines='none' class='edit-profile-header-item'
          style={{
            background: "url(assets/namecard/" + newNamecardImage + ") no-repeat center fixed",
            backgroundSize: "cover",
            backgroundColor: "var(--pickment-color-secondary)"
          }}
        >
          <IonGrid>
            <IonRow class='ion-align-items-center'>
              <IonCol size='1' class='font-fredoka-one'>
                #
              </IonCol>

              <IonCol size='auto'>
                <div
                  className='edit-profile-header-item-frame margin-lr-auto'
                  style={{
                    backgroundImage: "linear-gradient(#" + newFrameColor.substring(0, 6) + ", #" + newFrameColor.substring(6) + ")"
                  }}
                >
                  <img src={'assets/avatar/' + newAvatarImage} className='edit-profile-header-item-avatar'/>
                </div>
              </IonCol>

              <IonCol size='auto'>
                {username}
              </IonCol>

              <IonCol size='auto'>
                {badge1image === ""?
                  <div className='edit-profile-header-item-badge-1'></div>
                :
                  <img src={'assets/badge/' + badge1image} className='edit-profile-header-item-badge-1'/>
                }
                {badge2image === ""?
                  <div className='edit-profile-header-item-badge-2'></div>
                :
                  <img src={'assets/badge/' + badge2image} className='edit-profile-header-item-badge-2'/>
                }
              </IonCol>

              <IonCol size='auto' class='edit-profile-header-item-float-right font-fredoka-one'>
                ####
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>
      </IonHeader>

      <IonContent fullscreen>
        <IonGrid class='edit-profile-grid ion-padding margin-lr-auto'>
          <IonRow>
            <h2 className='font-fredoka-one text-color-primary'>IKON PROFIL</h2>
          </IonRow>
          <IonRow>
            {avatars && avatars.length > 0 &&
              avatars.sort((a, b) => b.status.localeCompare(a.status) || a.id.localeCompare(b.id)).map(a => (
                <IonCol size='3' class='ion-margin-bottom' key={a.id} 
                  onClick={() => {
                    if(a.status === "1") {
                      setNewAvatarId(a.id);
                      setNewAvatarImage(a.image);
                    }
                  }}
                >
                  <div className={a.status === "1"? 'edit-avatar-container cursor-pointer' : 'edit-avatar-container'}>
                    <img src={'assets/avatar/' + a.image} className={a.id === newAvatarId? 'edit-avatar-item-selected' : 'edit-avatar-item'}/>
                    {a.status === "0" &&
                      <>
                        <div className='edit-avatar-item-locked-background'/>
                        <IonIcon icon={lockClosed} class='edit-avatar-item-locked-icon'/>
                      </>
                    }
                  </div>
                  <div className='edit-avatar-label'>{a.title}</div>
                </IonCol>
              ))
            }
          </IonRow>

          <IonRow>
            <h2 className='font-fredoka-one text-color-primary'>BINGKAI PROFIL</h2>
          </IonRow>
          <IonRow>
            {frames && frames.length > 0 &&
              frames.map(f => (
                <IonCol size='3' class='ion-margin-bottom' key={f.id}
                  onClick={() => {
                    if(f.status === "1") {
                      setNewFrameId(f.id);
                      setNewFrameColor(f.color);
                    }
                  }}
                >
                  <div className={f.status === "1"? 'edit-frame-container cursor-pointer' : 'edit-frame-container'}>
                    <div
                      className='edit-frame-item'
                      style={{
                        backgroundImage: "linear-gradient(#" + f.color.substring(0, 6) + ", #" + f.color.substring(6) + ")"
                      }}
                    />
                    <div className='edit-frame-item-middle'/>
                    {f.id === newFrameId && <IonIcon icon={checkmark} class='edit-frame-item-selected'/>}
                    {f.status === "0" && <IonIcon icon={lockClosed} class='edit-frame-item-locked'/>}
                  </div>
                  <div className='edit-frame-label'>Level {f.level}</div>
                </IonCol>
              ))
            }
          </IonRow>

          <IonRow>
            <h2 className='font-fredoka-one text-color-primary'>KARTU NAMA</h2>
          </IonRow>
          <IonRow>
            {namecards && namecards.length > 0 &&
              namecards.sort((a, b) => b.status.localeCompare(a.status) || a.id.localeCompare(b.id)).map(n => (
                <IonCol size='6' class='ion-margin-bottom' key={n.id}>
                  <div className='edit-namecard-container'
                    onClick={() => {
                      if(n.status === "1") {
                        setNewNamecardId(n.id);
                        setNewNamecardImage(n.image);
                      }
                    }}
                  >
                    <img src={'assets/namecard/' + n.image} className={n.id === newNamecardId? 'edit-namecard-item-selected' : 'edit-namecard-item'}/>
                    {n.status === "0" &&
                      <>
                        <div className='edit-namecard-item-locked-background'/>
                        <IonIcon icon={lockClosed} class='edit-namecard-item-locked-icon'/>
                      </>
                    }
                  </div>
                  <div className='edit-namecard-label'>{n.title}</div>
                </IonCol>
              ))
            }
          </IonRow>
        </IonGrid>
      </IonContent>

      <IonFooter class='edit-profile-footer'>
        <IonGrid>
          <IonRow class='edit-profile-footer-row margin-lr-auto'>
            <IonCol size='auto'>
              <IonButton class='button-short-primary' onClick={editProfileHandler}>Simpan</IonButton>
            </IonCol>

            <IonCol size='auto'>
              <IonButton class='button-short-primary-outline' onClick={resetInputHandler}>Reset</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonFooter>
    </IonPage>
  );
};

export default EditProfile;
