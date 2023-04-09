import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, NavContext } from '@ionic/react';
import { caretBack } from 'ionicons/icons';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import UserContext from '../data/user-context';

import './EditInfo.css';

const EditInfo: React.FC = () => {
  const userCtx = useContext(UserContext);
  const history = useHistory();

  const { navigate } = useContext(NavContext);

  const redirect = useCallback(
		() => navigate('/welcome'),
		[navigate]
	);

  const [name, setName] = useState("");

	useEffect(() => {
		if(userCtx.user.length === 0) {
      redirect();
    }
    else {
      if(userCtx.user[0].uid != -1) {
        const formData = new FormData();

        formData.append('uid', userCtx.user[0].uid.toString());

        // axios.post("http://localhost/PickMent/getUserInfo.php", formData).then(res => {
        //   setName(res.data.info[0].name);
        // });
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
      </IonContent>
    </IonPage>
  );
};

export default EditInfo;
