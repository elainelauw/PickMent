import { IonButton, IonCol, IonContent, IonGrid, IonPage, IonRow, IonText } from '@ionic/react';

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
                <IonText class='error404-text ion-text-center font-fredoka-one margin-lr-auto'>
                  <h2>404</h2>
                  <h2>LAMAN TIDAK DITEMUKAN</h2>
                </IonText>
              </IonRow>
            </IonCol>
          </IonRow>

          <IonRow class='error404-row-bottom ion-align-items-center'>
            <IonButton href='\' class='margin-lr-auto button-short-primary'>Kembali</IonButton>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Error404;
