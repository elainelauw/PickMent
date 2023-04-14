import { IonBackButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonPage, IonRow, IonText, IonTitle, IonToolbar, NavContext } from '@ionic/react';
import { caretBack, caretForward, people } from 'ionicons/icons';
import { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

import UserContext from '../data/user-context';

import './Uploaded.css';

const Uploaded: React.FC = () => {
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

  const [uploads, setUploads] = useState<Array<any>>([]);

	useEffect(() => {
		if(userCtx.user.length === 0) {
      redirect();
    }
    else {
      if(userCtx.user[0].uid != -1) {
        const formData = new FormData();

        formData.append('uid', userCtx.user[0].uid.toString());

        axios.post("http://localhost/PickMent/getProfile.php", formData).then(res => {
          if(res.data.profile[0].status === "0") {
            redirect404();
          }
        });

        axios.post("http://localhost/PickMent/getUploads.php", formData).then(res => {
          setUploads(res.data.uploads);
        });
      }
    }
	}, [userCtx]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar class='toolbar-color-secondary'>
          <IonButtons slot='start'>
            <IonBackButton defaultHref='profile' icon={caretBack}/>
          </IonButtons>

          <IonTitle slot='end' class='font-fredoka-one'>
            P I C K M E N T
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonGrid>
          {uploads && uploads.length > 0 &&
            uploads.map(u => (
              <IonItem href={'/uploaded/' + u.id.padStart(6, '0')} lines='none' class='uploaded-item' key={u.id}>
                <IonGrid>
                  <IonRow class='ion-align-items-center'>
                    <IonCol class='uploaded-text'>
                      <IonRow class='font-fredoka-one'>
                        {u.title}
                      </IonRow>

                      <IonRow class='uploaded-description'>
                        #{u.id.padStart(6, '0')} | {moment(u.time, 'YYYY-MM-DD hh:mm:ss').format("DD-MM-YYYY HH:mm")}
                      </IonRow>
                    </IonCol>

                    <IonCol size='auto'>
                      <IonRow class='uploaded-float-right ion-align-items-center'>
                        <div className='uploaded-players'>
                          <IonIcon icon={people}/>
                          <IonText> {u.counter}/{u.target}</IonText>
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

export default Uploaded;
