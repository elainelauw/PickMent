import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonPage, IonRow, NavContext } from '@ionic/react';
import { mail, mailUnread, personCircle, ribbon, sparkles, trophy } from 'ionicons/icons';
import { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';

import UserContext from '../data/user-context';

import './Home.css';

const Home: React.FC = () => {
  const userCtx = useContext(UserContext);

  const { navigate } = useContext(NavContext);

  const redirect = useCallback(
		() => navigate('/welcome'),
		[navigate]
	);

  const [notifications, setNotifications] = useState<Array<any>>([]);
  const [isNotificationRead, setIsNotificationRead] = useState(true);

  const [showIllustration, setShowIllustration] = useState(false);

	useEffect(() => {
		if(userCtx.user.length === 0) {
      redirect();
    }
    else {
      if(userCtx.user[0].uid != -1) {
        const formData = new FormData();

        formData.append('uid', userCtx.user[0].uid.toString());

        axios.post("http://localhost/PickMent/getNotifications.php", formData).then(res => {
          setNotifications(res.data.notifications);
        });

        axios.post("http://localhost/PickMent/getProfile.php", formData).then(res => {
          if(parseInt(res.data.profile[0].participation) > 0) {
            setShowIllustration(true);
          }
        });
      }
    }
	}, [userCtx]);

  useEffect(() => {
		if(notifications?.filter(n => n.status === "0").length > 0) {
      setIsNotificationRead(false);
    }
	}, [notifications]);

  return (
    <IonPage>
      <IonContent class='home-content' fullscreen>
        <IonGrid class='home-grid ion-no-padding'>
          <IonRow class='home-row'>
            <IonRow class='home-row-gradient ion-align-items-center'>
              <IonCol>
                <IonRow class='ion-padding'>
                  <img src='assets/icon/PickMent.png' className='home-logo margin-lr-auto'/>
                </IonRow>

                <IonRow class='ion-padding'>
                  <IonCol>
                    <IonRow>
                      <IonButton href='\play' class='margin-lr-auto button-big-primary'>
                        <img src='assets/icon/LR Arrow.gif' className='home-play-button-arrow margin-lr-auto'/>
                        <h2 className='home-play-button-text'>MAIN</h2>
                        <img src='assets/icon/RL Arrow.gif' className='home-play-button-arrow margin-lr-auto'/>
                      </IonButton>
                    </IonRow>
                  </IonCol>
                </IonRow>

                <IonRow class='ion-padding'>
                  <IonCol>
                    <IonRow>
                      <IonButton href='\leaderboard' class='margin-lr-auto button-long-primary'>
                        <IonIcon class='home-button-icon' slot='start' icon={trophy}/>
                        Papan Peringkat
                      </IonButton>
                    </IonRow>

                    <IonRow>
                      <IonButton href='\notification' class='margin-lr-auto button-long-primary'>
                        <IonIcon class='home-button-icon' slot='start' icon={isNotificationRead? mail : mailUnread}/>
                        Notifikasi
                      </IonButton>
                    </IonRow>

                    <IonRow>
                      <IonButton href='\archive' class='margin-lr-auto button-long-primary'>
                        <IonIcon class='home-button-icon' slot='start' icon={ribbon}/>
                        Arsip
                      </IonButton>
                    </IonRow>

                    <IonRow>
                      <IonButton href='\profile' class='margin-lr-auto button-long-primary'>
                        <IonIcon class='home-button-icon' slot='start' icon={personCircle}/>
                        Profil
                      </IonButton>
                    </IonRow>

                    <IonRow>
                      <IonButton href='\illustration' class='margin-lr-auto button-long-primary' disabled={!showIllustration}>
                        <IonIcon class='home-button-icon' slot='start' icon={sparkles}/>
                        Ilustrasi
                      </IonButton>
                    </IonRow>
                  </IonCol>
                </IonRow>

                <IonRow class='ion-padding'>
                  <IonCol>
                    <IonRow>
                      <IonButton href='\about' class='margin-lr-auto button-long-primary-outline' color='outline'>Tentang PickMent</IonButton>
                    </IonRow>
                  </IonCol>
                </IonRow>
              </IonCol>
            </IonRow>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
