import { IonBackButton, IonButtons, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonPage, IonTitle, IonToast, IonToolbar, NavContext } from '@ionic/react';
import { caretBack } from 'ionicons/icons';
import { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

import UserContext from '../data/user-context';

import './Notification.css';

const Notification: React.FC = () => {
  const userCtx = useContext(UserContext);

  const { navigate } = useContext(NavContext);

  const redirect = useCallback(
		() => navigate('/welcome'),
		[navigate]
	);

  const [notifications, setNotifications] = useState<Array<any>>([]);

	useEffect(() => {
		if(userCtx.user.length === 0) {
      redirect();
    }
    else {
      const formData = new FormData();

      formData.append('uid', userCtx.user[0].uid.toString());

      axios.post("http://localhost/PickMent/getNotifications.php", formData).then(res => {
        setNotifications(res.data.notifications);
      });
    }
	}, [userCtx]);

  useEffect(() => {
		if(notifications?.filter(n => n.status === "0").length > 0) {
      const formData = new FormData();

      formData.append('uid', userCtx.user[0].uid.toString());

      axios.post("http://localhost/PickMent/readNotifications.php", formData);
    }
	}, [notifications]);

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
          {notifications && notifications.length > 0 &&
            notifications.map(n => (
              <IonItem lines='full' class='notification-text margin-lr-auto' key={n.id}>
                <IonLabel class='ion-text-wrap'>
                  <h3 className={n.status === "0"? 'text-color-secondary' : 'notification-read'}>
                    <b>{n.title}</b>
                  </h3>

                  <p className={n.status === "0"? 'text-color-secondary' : 'notification-read'}>
                    {moment(n.time, 'YYYY-MM-DD hh:mm:ss').format("DD-MM-YYYY HH:mm")}
                  </p>

                  <p/>

                  <p className={n.status === "0"? 'text-color-secondary' : 'notification-read'}>
                    {n.description}
                  </p>
                </IonLabel>
              </IonItem>
            ))
          }

          <IonItem lines='none' class='ion-text-center'>
            <IonLabel>
              <p>Akhir dari notifikasi</p>
            </IonLabel>
          </IonItem>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Notification;
