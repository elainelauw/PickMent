import { IonBackButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonPage, IonRow, IonText, IonTitle, IonToolbar, NavContext } from '@ionic/react';
import { caretBack, caretForward, heartCircle, trophy } from 'ionicons/icons';
import { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

import UserContext from '../data/user-context';

import './Archive.css';

const Archive: React.FC = () => {
  const userCtx = useContext(UserContext);

  const { navigate } = useContext(NavContext);

  const redirect = useCallback(
		() => navigate('/welcome'),
		[navigate]
	);

  const [histories, setHistories] = useState<Array<any>>([]);

	useEffect(() => {
		if(userCtx.user.length === 0) {
      redirect();
    }
    else {
      const formData = new FormData();

      formData.append('uid', userCtx.user[0].uid.toString());

      axios.post("http://localhost/PickMent/getHistories.php", formData).then(res => {
        setHistories(res.data.histories);
      });
    }
	}, [userCtx]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar class='toolbar-color-secondary'>
          <IonButtons slot='start'>
            <IonBackButton defaultHref='home' icon={caretBack}/>
          </IonButtons>

          <IonTitle slot='end' class='font-fredoka-one'>
            P I C K M E N T
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonGrid>
          {histories && histories.length > 0 &&
            histories.map(h => (
              <IonItem lines='none' href={'\\' + h.setId.padStart(6, '0')} class={h.status === "0"? 'archive-history-incomplete margin-lr-auto' : 'archive-history-complete margin-lr-auto'} key={h.setId}>
                <IonGrid>
                  <IonRow class='ion-align-items-center'>
                    <IonCol class='archive-history-text'>
                      <IonRow class='font-fredoka-one'>
                        {h.setTitle}
                      </IonRow>
    
                      <IonRow class='archive-history-description'>
                        #{h.setId.padStart(6, '0')} | {moment(h.time, 'YYYY-MM-DD hh:mm:ss').format("DD-MM-YYYY HH:mm")}
                      </IonRow>
                    </IonCol>
    
                    <IonCol size='auto'>
                      <IonRow class='archive-history-float-right'>
                        <div className='archive-history-rank'>
                          <IonIcon icon={trophy}/>
                          <IonText> {h.rank}</IonText>
                        </div>
    
                        <div className='archive-history-score'>
                          <IonIcon icon={heartCircle}/>
                          <IonText> {h.score}</IonText>
                        </div>
    
                        <div>
                          <IonIcon icon={caretForward}/>
                        </div>
                      </IonRow>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonItem>
            ))
          }
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Archive;
