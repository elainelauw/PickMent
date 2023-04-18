import { IonButton, IonCol, IonContent, IonGrid, IonPage, IonRow, NavContext } from '@ionic/react';
import { useCallback, useContext, useEffect } from 'react';

import UserContext from '../data/user-context';

import './About.css';

const About: React.FC = () => {
  const userCtx = useContext(UserContext);

  const { navigate } = useContext(NavContext);

  const redirect = useCallback(
		() => navigate('/welcome'),
		[navigate]
	);

	useEffect(() => {
		if(userCtx.user.length === 0) {
      redirect();
    }
	}, [userCtx]);

  return (
    <IonPage>
      <IonContent class='about-content' fullscreen>
        <IonGrid class='about-grid ion-no-padding'>
          <IonRow class='about-row'>
            <IonRow class='about-row-gradient ion-align-items-center'>
              <IonCol>
                <IonRow class='ion-padding'>
                  <img src='assets/icon/PickMent.png' className='about-logo margin-lr-auto'/>
                </IonRow>

                <IonRow class='ion-padding ion-text-center'>
                  <IonCol>
                    <h2 className='font-fredoka-one text-color-primary'>PENGEMBANG</h2>
                    <p className='text-color-primary'>Elaine</p>
                    
                    <br/>

                    <h2 className='font-fredoka-one text-color-primary'>DIKEMBANGKAN MENGGUNAKAN</h2>
                    <p className='text-color-primary'>
                      Ionic React<br/>
                      XAMPP<br/>
                      Capacitor Storage<br/>
                      Axios<br/>
                      SheetJS<br/>
                      ReactExportTableToExcel<br/>
                      Moment.js<br/>
                      Pexels
                    </p>
                  </IonCol>
                </IonRow>

                <IonRow class='ion-padding ion-text-center'>
                  <IonButton href='\home' class='margin-lr-auto button-long-primary-outline' color='outline'>Kembali ke Menu Utama</IonButton>
                </IonRow>
              </IonCol>
            </IonRow>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default About;
