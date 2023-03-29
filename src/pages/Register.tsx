import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonRow, IonToast, NavContext } from '@ionic/react';
import axios from 'axios';
import { eyeOff, eye } from 'ionicons/icons';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import UserContext from '../data/user-context';

import './Register.css';

const Register: React.FC = () => {
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
  const [confirmPassword, setConfirmPassword] = useState('');

  async function registerUserHandler() {
    if(username === '') {
      return setToastMessage('Nama Pengguna tidak boleh kosong.');
    }
    else {
      if(username.length < 2 || username.length > 10) {
        return setToastMessage('Nama Pengguna harus terdiri dari minimal 2 karakter dan maksimal 10 karakter.');
      }
      else {
        if(!/^[a-zA-Z0-9]*$/.test(username)) {
          return setToastMessage('Nama Pengguna hanya boleh terdiri dari karakter huruf dan karakter angka.')
        }
      }
    }

    if(password === '') {
      return setToastMessage('Kata Sandi tidak boleh kosong.');
    }
    else {
      if(password.length < 8) {
        return setToastMessage('Kata Sandi harus terdiri dari minimal 8 karakter.');
      }
      else {
        if(!/^[ -~]*$/.test(password)) {
          return setToastMessage('Kata Sandi mengandung karakter yang tidak diizinkan.');
        }
      }
    }

    if(confirmPassword === '') {
      return setToastMessage('Konfirmasi Kata Sandi tidak boleh kosong.');
    }
    else {
      if(confirmPassword !== password) {
        return setToastMessage('Konfirmasi Kata Sandi tidak sesuai dengan Kata Sandi.');
      }
    }

    const formData = new FormData();

    formData.append('username', username);
    formData.append('password', password);

    axios.post("http://localhost/PickMent/addUser.php", formData).then(res => {
      if(res.data.success === 1) {
        history.replace('/welcome');
      }
      else {
        setToastMessage(res.data.message);
      }
    });
  }

  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);
  
  const showConfirmPasswordHandler = () => {
		setIsConfirmPasswordShown(!isConfirmPasswordShown);
	}

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
        <IonGrid class='register-grid ion-no-padding'>
          <IonRow class='register-row-top ion-align-items-center'>
            <img src='assets/icon/PickMent.png' className='register-logo margin-lr-auto'/>
          </IonRow>

          <IonRow class='register-row-bottom'>
            <IonCol>
              <IonRow class='ion-padding ion-text-center'>
                <IonCol>
                  <h2 className='font-fredoka-one text-color-primary'>DAFTAR AKUN</h2>
                </IonCol>
              </IonRow>

              <IonRow class='ion-padding register-form-row margin-lr-auto'>
                <IonItem lines='none' class='register-form-item'>
                  <IonLabel position="stacked" class='input-label-primary'>Nama Pengguna</IonLabel>
                  <IonItem lines='none' class='input-primary'>
                    <IonInput placeholder="Nama pengguna" type='text' value={username} onIonChange={(e: any) => setUsername(e.target.value)}/>
                  </IonItem>
                </IonItem>

                <IonItem lines='none' class='register-form-item'>
                  <IonLabel position="stacked" class='input-label-primary'>Kata Sandi</IonLabel>
                  <IonItem lines='none' class='input-primary'>
                    <IonInput placeholder="Kata sandi" type={isPasswordShown? 'text' : 'password'} value={password} onIonChange={(e: any) => setPassword(e.target.value)}/>
                    <IonIcon class='input-icon-primary cursor-pointer' slot='end' icon={isPasswordShown? eyeOff : eye} onClick={showPasswordHandler}/>
                  </IonItem>
                </IonItem>

                <IonItem lines='none' class='register-form-item'>
                  <IonLabel position="stacked" class='input-label-primary'>Konfirmasi Kata Sandi</IonLabel>
                  <IonItem lines='none' class='input-primary'>
                    <IonInput placeholder="Ketik ulang kata sandi" type={isConfirmPasswordShown? 'text' : 'password'} value={confirmPassword} onIonChange={(e: any) => setConfirmPassword(e.target.value)}/>
                    <IonIcon class='input-icon-primary cursor-pointer' slot='end' icon={isConfirmPasswordShown? eyeOff : eye} onClick={showConfirmPasswordHandler}/>
                  </IonItem>
                </IonItem>
              </IonRow>

              <IonRow class='ion-padding'>
                <IonCol>
                  <IonRow>
                    <IonButton class='margin-lr-auto button-short-primary' onClick={registerUserHandler}>Daftar</IonButton>
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

export default Register;
