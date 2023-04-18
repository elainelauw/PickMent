import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToast, IonToolbar, NavContext } from '@ionic/react';
import { caretBack } from 'ionicons/icons';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';

import UserContext from '../data/user-context';

import './EditInfo.css';

const EditInfo: React.FC = () => {
  const userCtx = useContext(UserContext);
  const history = useHistory();

  const { navigate } = useContext(NavContext);

  const redirect = useCallback(
		() => navigate('/welcome'),
		[navigate]
	);

  const [toastMessage, setToastMessage] = useState('');

  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [sex, setSex] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [occupation, setOccupation] = useState("");
  const [education, setEducation] = useState("");

  const [newName, setNewName] = useState("");
  const [newBirthYear, setNewBirthYear] = useState("");
  const [newSex, setNewSex] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newOccupation, setNewOccupation] = useState("");
  const [newEducation, setNewEducation] = useState("");

	useEffect(() => {
		if(userCtx.user.length === 0) {
      redirect();
    }
    else {
      if(userCtx.user[0].uid != -1) {
        const formData = new FormData();

        formData.append('uid', userCtx.user[0].uid.toString());

        axios.post("http://localhost/PickMent/getUserInfo.php", formData).then(res => {
          setName(res.data.info[0].name);
          setBirthYear(res.data.info[0].birthYear);
          setSex(res.data.info[0].sex);
          setPhone(res.data.info[0].phone);
          setEmail(res.data.info[0].email);
          setLocation(res.data.info[0].location);
          setOccupation(res.data.info[0].occupation);
          setEducation(res.data.info[0].education);
          
          setNewName(res.data.info[0].name);
          setNewBirthYear(res.data.info[0].birthYear);
          setNewSex(res.data.info[0].sex);
          setNewPhone(res.data.info[0].phone);
          setNewEmail(res.data.info[0].email);
          setNewLocation(res.data.info[0].location);
          setNewOccupation(res.data.info[0].occupation);
          setNewEducation(res.data.info[0].education);
        });
      }
    }
	}, [userCtx]);

  const compareWith = (o1: any, o2: any) => {
    return o1 && o2 ? o1 === o2 : o1 === o2;
  };

  const editInfoHandler = () => {
    if(!/^[ -~]*$/.test(newName)) {
      return setToastMessage('Nama Lengkap mengandung karakter yang tidak dikenali.');
    }

    if((newPhone !== "") && (!/^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(newPhone))) {
      return setToastMessage('Format Nomor Telepon tidak dikenali.');
    }

    if((newEmail !== "") && (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(newEmail))) {
      return setToastMessage('Format Email tidak dikenali.');
    }

    if(!/^[ -~]*$/.test(newLocation)) {
      return setToastMessage('Domisili mengandung karakter yang tidak dikenali.');
    }

    if(!/^[ -~]*$/.test(newOccupation)) {
      return setToastMessage('Pekerjaan mengandung karakter yang tidak dikenali.');
    }

    if(
      newName !== name ||
      newBirthYear !== birthYear ||
      newSex !== sex ||
      newPhone !== phone ||
      newEmail !== email ||
      newLocation !== location ||
      newOccupation !== occupation ||
      newEducation !== education
    ) {
      const formData = new FormData();

      formData.append('uid', userCtx.user[0].uid.toString());
      formData.append('name', newName);
      formData.append('birthYear', newBirthYear);
      formData.append('sex', newSex);
      formData.append('phone', newPhone);
      formData.append('email', newEmail);
      formData.append('location', newLocation);
      formData.append('occupation', newOccupation);
      formData.append('education', newEducation);

      axios.post("http://localhost/PickMent/updateUserInfo.php", formData).then(res => {
        if(res.data.success === 1) {
          history.replace('/profile');
        }
        else {
          setToastMessage(res.data.message);
        }
      });
    }
    else {
      history.replace('/profile');
    }
	}

  const resetInputHandler = () => {
    setNewName(name);
    setNewBirthYear(birthYear);
    setNewSex(sex);
    setNewPhone(phone);
    setNewEmail(email);
    setNewLocation(location);
    setNewOccupation(occupation);
    setNewEducation(education);
	}

  return (
    <IonPage>
      <IonToast
				isOpen={!!toastMessage}
				message={toastMessage}
				duration={2000}
				onDidDismiss={() => { setToastMessage(''); }}
			/>

      <IonHeader>
        <IonToolbar class='toolbar-color-secondary'>
          <IonButtons slot='start'>
            <IonBackButton defaultHref='profile' icon={caretBack}/>
          </IonButtons>

          <IonTitle slot='end' class='font-fredoka-one'>
            P I C K M E N T
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonGrid>
          <IonRow class='ion-padding ion-text-center'>
            <IonCol>
              <h2 className='font-fredoka-one text-color-primary'>DATA DIRI</h2>
            </IonCol>
          </IonRow>

          <IonRow class='edit-info-form-row ion-padding margin-lr-auto'>
            <IonItem lines='none' class='edit-info-form-item'>
              <IonLabel position='stacked' class='input-label-primary'>Nama Lengkap</IonLabel>
              <IonItem lines='none' class='input-primary'>
                <IonInput placeholder='Nama lengkap' type='text' value={newName} onIonChange={(e: any) => setNewName(e.target.value)}/>
              </IonItem>
            </IonItem>

            <IonItem lines='none' class='edit-info-form-item'>
              <IonLabel position='stacked' class='input-label-primary'>Tahun Lahir</IonLabel>
              <IonItem lines='none' class='input-primary'>
                <IonSelect 
                  interfaceOptions={{
                    header: 'Tahun Lahir'
                  }}
                  placeholder='Tahun lahir'
                  class='select-primary'
                  value={newBirthYear}
                  compareWith={compareWith}
                  onIonChange={(e: any) => setNewBirthYear(e.detail.value)}
                >
                  {[...Array(130)].map((_, i) =>
                    <IonSelectOption value={(new Date().getFullYear() - i).toString()} key={i}>{new Date().getFullYear() - i}</IonSelectOption>
                  )}
                </IonSelect>
              </IonItem>
            </IonItem>

            <IonItem lines='none' class='edit-info-form-item'>
              <IonLabel position='stacked' class='input-label-primary'>Jenis Kelamin</IonLabel>
              <IonItem lines='none' class='input-primary'>
                <IonSelect 
                  interfaceOptions={{
                    header: 'Jenis Kelamin'
                  }}
                  placeholder='Jenis kelamin'
                  class='select-primary'
                  value={newSex}
                  compareWith={compareWith}
                  onIonChange={(e: any) => setNewSex(e.detail.value)}
                >
                  <IonSelectOption value='m'>Laki-laki</IonSelectOption>
                  <IonSelectOption value='f'>Perempuan</IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonItem>

            <IonItem lines='none' class='edit-info-form-item'>
              <IonLabel position='stacked' class='input-label-primary'>Nomor Telepon</IonLabel>
              <IonItem lines='none' class='input-primary'>
                <IonInput placeholder='Nomor telepon' type='text' value={newPhone} onIonChange={(e: any) => setNewPhone(e.target.value)}/>
              </IonItem>
            </IonItem>

            <IonItem lines='none' class='edit-info-form-item'>
              <IonLabel position='stacked' class='input-label-primary'>Email</IonLabel>
              <IonItem lines='none' class='input-primary'>
                <IonInput placeholder='Email' type='text' value={newEmail} onIonChange={(e: any) => setNewEmail(e.target.value)}/>
              </IonItem>
            </IonItem>

            <IonItem lines='none' class='edit-info-form-item'>
              <IonLabel position='stacked' class='input-label-primary'>Domisili</IonLabel>
              <IonItem lines='none' class='input-primary'>
                <IonInput placeholder='Domisili' type='text' value={newLocation} onIonChange={(e: any) => setNewLocation(e.target.value)}/>
              </IonItem>
            </IonItem>

            <IonItem lines='none' class='edit-info-form-item'>
              <IonLabel position='stacked' class='input-label-primary'>Pekerjaan</IonLabel>
              <IonItem lines='none' class='input-primary'>
                <IonInput placeholder='Pekerjaan' type='text' value={newOccupation} onIonChange={(e: any) => setNewOccupation(e.target.value)}/>
              </IonItem>
            </IonItem>

            <IonItem lines='none' class='edit-info-form-item'>
              <IonLabel position='stacked' class='input-label-primary'>Pendidikan Terakhir</IonLabel>
              <IonItem lines='none' class='input-primary'>
                <IonSelect 
                  interfaceOptions={{
                    header: 'Pendidikan Terakhir'
                  }}
                  placeholder='Pendidikan terakhir'
                  class='select-primary'
                  value={newEducation}
                  compareWith={compareWith}
                  onIonChange={(e: any) => setNewEducation(e.detail.value)}
                >
                  <IonSelectOption value="-">Tidak sekolah</IonSelectOption>
                  <IonSelectOption value="SD">Tamat SD/sederajat</IonSelectOption>
                  <IonSelectOption value="SMP">Tamat SMP/sederajat</IonSelectOption>
                  <IonSelectOption value="SMA">Tamat SMA/sederajat</IonSelectOption>
                  <IonSelectOption value="D2">Tamat Diploma I/II</IonSelectOption>
                  <IonSelectOption value="D3">Tamat Diploma III/sederajat</IonSelectOption>
                  <IonSelectOption value="S1">Tamat Sarjana/sederajat</IonSelectOption>
                  <IonSelectOption value="S2">Tamat Strata II</IonSelectOption>
                  <IonSelectOption value="S3">Tamat Strata III</IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonItem>
          </IonRow>

          <IonRow class='edit-info-buttons-row ion-padding margin-lr-auto'>
            <IonCol size='auto'>
              <IonButton class='button-shorter-primary' onClick={editInfoHandler}>Simpan</IonButton>
            </IonCol>

            <IonCol size='auto'>
              <IonButton class='button-shorter-primary-outline' onClick={resetInputHandler}>Reset</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default EditInfo;
