import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonRow, IonToast, NavContext } from '@ionic/react';
import axios from 'axios';
import { eyeOff, eye } from 'ionicons/icons';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import UserContext from '../data/user-context';

import './Login.css';

const Login: React.FC = () => {
  const userCtx = useContext(UserContext);
  const history = useHistory();

  const { navigate } = useContext(NavContext);

  const redirect = useCallback(
		() => navigate('/home', 'forward'),
		[navigate]
	);

	useEffect(() => {
		if(userCtx.user.length > 0 && userCtx.user[0].uid != -1) {
      redirect();
    }
	}, [userCtx]);

  const [toastMessage, setToastMessage] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function loginHandler() {
    if(username === '') {
      return setToastMessage('Nama Pengguna tidak boleh kosong.');
    }

    if(password === '') {
      return setToastMessage('Kata Sandi tidak boleh kosong.');
    }

    const formData = new FormData();

    formData.append('username', username);
    formData.append('password', password);

    axios.post("http://localhost/PickMent/login.php", formData).then(res => {
      if(res.data.success === 1) {
        userCtx.login(res.data.user[0].uid);

        history.replace('/home');
      }
      else {
        setToastMessage(res.data.message);
      }
    });
  }

  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const showPasswordHandler = () => {
		setIsPasswordShown(!isPasswordShown);
	}

  return (
    <IonPage>
      <IonToast
				isOpen={!!toastMessage}
				message={toastMessage}
				duration={2000}
				onDidDismiss={() => { setToastMessage(''); }}
			/>
      
      <IonContent fullscreen>
        <IonGrid class='login-grid ion-no-padding'>
          <IonRow class='login-row-top ion-align-items-center'>
            <img src='assets/icon/PickMent.png' className='login-logo margin-lr-auto'/>
          </IonRow>

          <IonRow class='login-row-bottom'>
            <IonCol>
              <IonRow class='ion-padding ion-text-center'>
                <IonCol>
                  <h2 className='font-fredoka-one text-color-primary'>MASUK AKUN</h2>
                </IonCol>
              </IonRow>

              <IonRow class='ion-padding login-form-row margin-lr-auto'>
                <IonItem lines='none' class='login-form-item'>
                  <IonLabel position="stacked" class='input-label-primary'>Nama Pengguna</IonLabel>
                  <IonItem lines='none' class='input-primary'>
                    <IonInput placeholder="Nama pengguna" type='text' value={username} onIonChange={(e: any) => setUsername(e.target.value)}/>
                  </IonItem>
                </IonItem>

                <IonItem lines='none' class='login-form-item'>
                  <IonLabel position="stacked" class='input-label-primary'>Kata Sandi</IonLabel>
                  <IonItem lines='none' class='input-primary'>
                    <IonInput placeholder="Kata sandi" type={isPasswordShown? 'text' : 'password'} value={password} onIonChange={(e: any) => setPassword(e.target.value)}/>
                    <IonIcon class='input-icon-primary cursor-pointer' slot='end' icon={isPasswordShown? eyeOff : eye} onClick={showPasswordHandler}/>
                  </IonItem>
                </IonItem>
              </IonRow>

              <IonRow class='ion-padding'>
                <IonCol>
                  <IonRow>
                    <IonButton class='margin-lr-auto button-short-primary' onClick={loginHandler}>Masuk</IonButton>
                  </IonRow>

                  <IonRow class='ion-padding-top'>
                    <IonButton href='\welcome' class='margin-lr-auto button-short-primary-outline' color='outline'>Batal</IonButton>
                  </IonRow>
                </IonCol>
              </IonRow>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;
