import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar, NavContext } from '@ionic/react';
import { caretBack } from 'ionicons/icons';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';

import UserContext from '../data/user-context';

import './Settings.css';

const Settings: React.FC = () => {
  const userCtx = useContext(UserContext);
  const history = useHistory();

  const { navigate } = useContext(NavContext);

  const redirect = useCallback(
		() => navigate('/welcome'),
		[navigate]
	);

  const [language, setLanguage] = useState("0");
  const [newLanguage, setNewLanguage] = useState("0");

	useEffect(() => {
		if(userCtx.user.length === 0) {
      redirect();
    }
    else {
      if(userCtx.user[0].uid != -1) {
        const formData = new FormData();

        formData.append('uid', userCtx.user[0].uid.toString());

        axios.post("http://localhost/PickMent/getSettings.php", formData).then(res => {
          setLanguage(res.data.settings[0].language);
          setNewLanguage(res.data.settings[0].language);
        });
      }
    }
	}, [userCtx]);

  const compareWith = (o1: any, o2: any) => {
    return o1 && o2 ? o1 === o2 : o1 === o2;
  };

  const settingsHandler = () => {
    if(newLanguage !== language) {
      const formData = new FormData();

      formData.append('uid', userCtx.user[0].uid.toString());
      formData.append('language', newLanguage);

      axios.post("http://localhost/PickMent/updateSettings.php", formData).then(res => {
        history.replace('/profile');
      });
    }
    else {
      history.replace('/profile');
    }
	}

  const resetInputHandler = () => {
    setNewLanguage(language);
	}

  return (
    <IonPage>
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
              <h2 className='font-fredoka-one text-color-primary'>PENGATURAN</h2>
            </IonCol>
          </IonRow>

          <IonRow class='settings-form-row ion-padding margin-lr-auto'>
            <IonItem lines='none' class='settings-form-item'>
              <IonLabel position='stacked' class='input-label-primary'>Preferensi Bahasa</IonLabel>
              <IonItem lines='none' class='input-primary'>
                <IonSelect 
                  interfaceOptions={{
                    header: 'Preferensi Bahasa'
                  }}
                  class='select-primary'
                  value={newLanguage}
                  compareWith={compareWith}
                  onIonChange={(e: any) => setNewLanguage(e.detail.value)}
                >
                  <IonSelectOption value='0'>Indonesia - Inggris</IonSelectOption>
                  <IonSelectOption value='1'>Indonesia</IonSelectOption>
                  <IonSelectOption value='2'>Inggris</IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonItem>
          </IonRow>

          <IonRow class='settings-buttons-row ion-padding margin-lr-auto'>
            <IonCol size='auto'>
              <IonButton class='button-shorter-primary' onClick={settingsHandler}>Simpan</IonButton>
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

export default Settings;
