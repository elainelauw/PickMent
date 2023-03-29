import { IonButton, IonCol, IonContent, IonGrid, IonPage, IonRow, IonText, NavContext } from '@ionic/react';
import { useCallback, useContext, useEffect } from 'react';

import UserContext from '../data/user-context';

import './Welcome.css';

const Welcome: React.FC = () => {
  const userCtx = useContext(UserContext);

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

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonGrid class='welcome-grid ion-no-padding'>
          <IonRow class='welcome-row-top ion-align-items-center'>
            <IonCol>
              <IonRow class='ion-padding'>
                <img src='assets/icon/PickMent.png' className='welcome-logo margin-lr-auto'/>
              </IonRow>

              <IonRow class='ion-padding'>
                <IonText class='welcome-text ion-text-center margin-lr-auto'>
                  Melalui <span className='font-fredoka-one'>Pick Element</span>, pengguna dapat mengalami aktivitas penentuan label sentimen yang menyenangkan seperti sedang bermain.
                </IonText>
              </IonRow>
            </IonCol>
          </IonRow>

          <IonRow class='welcome-row-bottom ion-align-items-center'>
            <IonCol>
              <IonRow>
                <IonButton href='\login' class='margin-lr-auto button-short-primary'>Masuk</IonButton>
              </IonRow>

              <IonRow class='ion-padding-top'>
                <IonButton href='\register' class='margin-lr-auto button-short-primary-outline' color='outline'>Daftar</IonButton>
              </IonRow>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Welcome;
