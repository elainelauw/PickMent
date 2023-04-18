import { IonButton, IonCol, IonContent, IonGrid, IonLabel, IonPage, IonRow, NavContext } from '@ionic/react';
import { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';

import UserContext from '../data/user-context';

import './Illustration.css';

const Illustration: React.FC = () => {
  const userCtx = useContext(UserContext);

  const { navigate } = useContext(NavContext);

  const redirect = useCallback(
		() => navigate('/welcome'),
		[navigate]
	);
  
  const redirect404 = useCallback(
		() => navigate('/404'),
		[navigate]
	);

  useEffect(() => {
    if(
      window.location.href.split('#')[1] &&
      window.location.href.split('#')[1] === "showEffect"
    ) {
      setShowEffect(true);
    }

		const interval = setInterval(() => {
      setShowEffect(false);
    }, 3000);
    return () => clearInterval(interval);
	}, []);

  const [illustration, setIllustration] = useState(0);
  const [showEffect, setShowEffect] = useState(false);

	useEffect(() => {
		if(userCtx.user.length === 0) {
      redirect();
    }
    if(userCtx.user[0].uid != -1) {
      const formData = new FormData();

        formData.append('uid', userCtx.user[0].uid.toString());

        axios.post("http://localhost/PickMent/getProfile.php", formData).then(res => {
          if(parseInt(res.data.profile[0].participation) > 0) {
            if(parseInt(res.data.profile[0].participation) < 2) {
              setIllustration(parseInt(res.data.profile[0].participation));
            }
            else {
              setIllustration(2);
            }
          }
          else {
            redirect404();
          }
        });
    }
	}, [userCtx]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonGrid class='illustration-grid ion-no-padding'>
          <IonRow class='illustration-row-top ion-align-items-center'>
            {[...Array(illustration)].map((_, i) =>
              <img
                className={
                  (i + 1) === illustration ||
                  !window.location.href.split('#')[1] ||
                  window.location.href.split('#')[1] !== "showEffect"?
                    'illustration-item-appear'
                  :
                    'illustration-item'
                }
                src={'assets/illustration/' + (i + 1) + '.png'} key={i}/>
            )}
            {showEffect &&
              <img className='illustration-effect' src={'assets/illustration/' + '2' + ' sparkles.gif'}/>
            }
          </IonRow>

          <IonRow class='illustration-row-bottom ion-align-items-center'>
            <IonCol>
              <IonRow class='ion-margin-start ion-margin-end'>
                <IonLabel class='margin-lr-auto'>
                  <p className='ion-padding-bottom ion-text-center illustration-text'>Partisipasi dalam set permainan untuk lihat perubahan lebih lanjut!</p>
                </IonLabel>
              </IonRow>

              <IonRow class='ion-padding-bottom'>
                <IonButton href='\home' class='margin-lr-auto button-long-primary'>Kembali ke Menu Utama</IonButton>
              </IonRow>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Illustration;
