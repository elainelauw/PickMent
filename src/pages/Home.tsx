import { IonCol, IonContent, IonGrid, IonPage, IonRow, IonText, NavContext } from '@ionic/react';
import { useCallback, useContext, useEffect } from 'react';

import UserContext from '../data/user-context';

import './Home.css';

const Home: React.FC = () => {
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
      <IonContent fullscreen>
        <IonGrid class='home-grid ion-no-padding'>
          <IonRow class='home-row-top ion-align-items-center'>
            <IonCol>
              <IonRow class='ion-padding'>
                <img src='assets/icon/PickMent.png' className='home-logo margin-lr-auto'/>
              </IonRow>

              <IonRow class='ion-padding'>
                <IonText class='home-text ion-text-center margin-lr-auto'>
                  HOME PAGE
                </IonText>
              </IonRow>
            </IonCol>
          </IonRow>

          <IonRow class='home-row-bottom ion-align-items-center'>
            <IonCol>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
