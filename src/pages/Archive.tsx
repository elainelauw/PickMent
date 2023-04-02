import { IonBackButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonPage, IonRow, IonText, IonTitle, IonToolbar, NavContext } from '@ionic/react';
import { caretBack, caretForward, gift, heartCircle, star, starOutline, trophy } from 'ionicons/icons';
import { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

import UserContext from '../data/user-context';

import './Archive.css';
import { useHistory } from 'react-router';

const Archive: React.FC = () => {
  const userCtx = useContext(UserContext);
  const history = useHistory();

  const { navigate } = useContext(NavContext);

  const redirect = useCallback(
		() => navigate('/welcome'),
		[navigate]
	);
  
  const [navbar, setNavbar] = useState(0);

  useEffect(() => {
    if(
      window.location.href.split('#')[1] &&
      parseInt(window.location.href.split('#')[1]) >= 0 &&
      parseInt(window.location.href.split('#')[1]) <= 2
    ) {
      setNavbar(parseInt(window.location.href.split('#')[1]));
    }
	}, []);

  const navbarHandler = (x: number) => {
		setNavbar(x);
    history.push('#' + x);
	}

  const [histories, setHistories] = useState<Array<any>>([]);
  const [achievements, setAchievements] = useState<Array<any>>([]);
  const [badgeCategories, setBadgeCategories] = useState<Array<any>>([]);

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

      axios.post("http://localhost/PickMent/getAchievements.php", formData).then(res => {
        setAchievements(res.data.achievements);
      });

      axios.post("http://localhost/PickMent/getBadgeCategories.php", formData).then(res => {
        setBadgeCategories(res.data.badgeCategories);
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
        <IonGrid class='archive-navbar ion-no-padding font-fredoka-one'>
          <IonRow class='archive-navbar-row margin-lr-auto'>
            <IonCol class={navbar === 0? 'archive-navbar-col-active' : 'archive-navbar-col-inactive'} onClick={() => navbarHandler(0)}>
              RIWAYAT
            </IonCol>

            <IonCol class={navbar === 1? 'archive-navbar-col-active' : 'archive-navbar-col-inactive'} onClick={() => navbarHandler(1)}>
              ACHIEVEMENT
            </IonCol>

            <IonCol class={navbar === 2? 'archive-navbar-col-active' : 'archive-navbar-col-inactive'} onClick={() => navbarHandler(2)}>
              MENDALI
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonGrid>
          {navbar === 0 && histories && histories.length > 0 &&
            histories.map(h => (
              <IonItem lines='none' href={'\\' + h.setId.padStart(6, '0')} class={h.status === "0"? 'archive-history-incomplete' : 'archive-history-complete'} key={h.setId}>
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

          {navbar === 1 && achievements && achievements.length > 0 &&
            achievements.map(a => (
              <IonItem lines='full' class='archive-achievement-text margin-lr-auto' key={a.id}>
                <IonLabel class={a.status === "0"? 'ion-text-wrap text-color-secondary' : 'ion-text-wrap text-color-primary'}>
                  <div className='font-fredoka-one'>
                    {a.title}
                  </div>

                  <div>
                    {a.description}
                  </div>

                  <div>
                    <IonIcon icon={gift}/> {a.reward}
                  </div>
                </IonLabel>
              </IonItem>
            ))
          }

          {navbar === 2 && badgeCategories && badgeCategories.length > 0 &&
            badgeCategories.map(b => (
              <IonItem lines='full' class='archive-badge-item margin-lr-auto' key={b.id}>
                <IonGrid class='archive-badge-grid'>
                  <IonRow class='ion-align-items-center'>
                    <IonCol size='auto' class='ion-margin-end'>
                      <IonRow>
                        <img src={'assets/badge/' + b.image} className='archive-badge-image margin-lr-auto'/>
                      </IonRow>

                      <IonRow class='archive-badge-stars margin-lr-auto'>
                        <IonIcon icon={parseInt(b.status) > 0? star : starOutline} class='archive-badge-bronze'/>
                        <IonIcon icon={parseInt(b.status) > 1? star : starOutline} class='archive-badge-silver'/>
                        <IonIcon icon={parseInt(b.status) > 2? star : starOutline} class='archive-badge-gold'/>
                      </IonRow>
                    </IonCol>

                    <IonCol class={b.status === "3"? 'text-color-primary' : 'text-color-secondary'}>
                      <IonRow class='font-fredoka-one'>
                        {b.title}
                      </IonRow>

                      <IonRow>
                        {b.description} ({b.counter}/{b.target})
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
