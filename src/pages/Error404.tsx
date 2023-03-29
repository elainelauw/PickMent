import { IonCol, IonContent, IonGrid, IonPage, IonRow, IonText } from '@ionic/react';

import './Error404.css';

const Error404: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonGrid class='error404-grid ion-no-padding'>
          <IonRow class='error404-row-top ion-align-items-center'>
            <IonCol>
              <IonRow class='ion-padding'>
                <img src='assets/icon/PickMent.png' className='error404-logo margin-lr-auto'/>
              </IonRow>

              <IonRow class='ion-padding'>
                <IonText class='error404-text ion-text-center margin-lr-auto'>
                  ERROR 404 PAGE
                </IonText>
              </IonRow>
            </IonCol>
          </IonRow>

          <IonRow class='error404-row-bottom ion-align-items-center'>
            <IonCol>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Error404;
