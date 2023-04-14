import { IonBackButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonPage, IonRow, IonText, IonTitle, IonToolbar, NavContext } from '@ionic/react';
import { caretBack, caretForward, list } from 'ionicons/icons';
import { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

import UserContext from '../data/user-context';

import './Pick.css';

const Pick: React.FC = () => {
  const userCtx = useContext(UserContext);

  const { navigate } = useContext(NavContext);

  const redirect = useCallback(
		() => navigate('/welcome'),
		[navigate]
	);

  const [optionList, setOptionList] = useState<Array<any>>([]);

	useEffect(() => {
		if(userCtx.user.length === 0) {
      redirect();
    }
    else {
      const formData = new FormData();

      formData.append('uid', userCtx.user[0].uid.toString());

      axios.post("http://localhost/PickMent/getSetList.php", formData).then(res => {
        setOptionList(res.data.list);
      });
    }
	}, [userCtx]);

  useEffect(() => {
		console.log(optionList);
	}, [optionList]);

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
          {optionList && optionList.length > 0 &&
            optionList.map(l => (
              <IonItem href={'/play/' + l.id.padStart(6, '0')} lines='none' class='pick-item' key={l.id}>
                <IonGrid>
                  <IonRow class='ion-align-items-center'>
                    <IonCol class='pick-text'>
                      <IonRow class='font-fredoka-one'>
                        {l.title}
                      </IonRow>

                      <IonRow class='pick-description'>
                        #{l.id.padStart(6, '0')} | {moment(l.time, 'YYYY-MM-DD hh:mm:ss').format("DD-MM-YYYY HH:mm")}
                      </IonRow>
                    </IonCol>

                    <IonCol size='auto'>
                      <IonRow class='pick-float-right ion-align-items-center'>
                        <div className='pick-counter'>
                          <IonIcon icon={list}/>
                          <IonText> {l.items}</IonText>
                        </div>

                        <img src={'assets/flag/' + l.language + '.png'} className='pick-language'/>

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

export default Pick;
