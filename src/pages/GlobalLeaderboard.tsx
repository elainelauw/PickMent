import { IonBackButton, IonButtons, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonPage, IonRow, IonTitle, IonToolbar, NavContext } from '@ionic/react';
import { caretBack, trophy } from 'ionicons/icons';
import { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

import UserContext from '../data/user-context';

import './GlobalLeaderboard.css';

const GlobalLeaderboard: React.FC = () => {
  const userCtx = useContext(UserContext);

  const { navigate } = useContext(NavContext);

  const redirect = useCallback(
		() => navigate('/welcome'),
		[navigate]
	);

  const [startTime, setStartTime] = useState("D MMM 'YY");
  const [endTime, setEndTime] = useState("D MMM 'YY");
  const [dayCounter, setDayCounter] = useState(0);
  const [hourCounter, setHourCounter] = useState(0);
  const [minuteCounter, setMinuteCounter] = useState(0);

  const [leaderboard, setLeaderboard] = useState<Array<any>>([]);

  useEffect(() => {
    moment.updateLocale('id', {
      monthsShort : [
          "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
          "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
      ]
    });
    
    axios.get("http://localhost/PickMent/getGlobalLeaderboard.php").then(res => {
      setStartTime(moment(res.data.startTime, 'YYYY-MM-DD hh:mm:ss').format("D MMM 'YY"));
      setEndTime(moment(res.data.endTime, 'YYYY-MM-DD hh:mm:ss').format("D MMM 'YY"));
      setDayCounter(res.data.days);
      setHourCounter(res.data.hours);
      setMinuteCounter(res.data.minutes);

      setLeaderboard(res.data.leaderboard);
    });

    const interval = setInterval(() => {
      axios.get("http://localhost/PickMent/getGlobalLeaderboard.php").then(res => {
        setStartTime(moment(res.data.startTime, 'YYYY-MM-DD hh:mm:ss').format("D MMM 'YY"));
        setEndTime(moment(res.data.endTime, 'YYYY-MM-DD hh:mm:ss').format("D MMM 'YY"));
        setDayCounter(res.data.days);
        setHourCounter(res.data.hours);
        setMinuteCounter(res.data.minutes);

        setLeaderboard(res.data.leaderboard);
      });
    }, 60000);
    return () => clearInterval(interval);
	}, []);

  const [rank, setRank] = useState("-");
  const [username, setUsername] = useState("username");
  const [avatarImage, setAvatarImage] = useState("Pemain.png");
  const [frameColor, setFrameColor] = useState("ffffffffffff");
  const [namecardImage, setNamecardImage] = useState("Pemain.jpg");
  const [badge1image, setBadge1image] = useState("");
  const [badge2image, setBadge2image] = useState("");
  const [weeklyXp, setWeeklyXp] = useState("0");

	useEffect(() => {
		if(userCtx.user.length === 0) {
      redirect();
    }
    if(userCtx.user[0].uid != -1) {
      const formData = new FormData();

      formData.append('uid', userCtx.user[0].uid.toString());

      axios.post("http://localhost/PickMent/getProfile.php", formData).then(res => {
        setRank(res.data.profile[0].rank);
        setUsername(res.data.profile[0].username);
        setAvatarImage(res.data.profile[0].avatarImage);
        setFrameColor(res.data.profile[0].frameColor);
        setNamecardImage(res.data.profile[0].namecardImage);
        setBadge1image(res.data.profile[0].badge1image);
        setBadge2image(res.data.profile[0].badge2image);
        setWeeklyXp(res.data.profile[0].weeklyXp);
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

      <IonContent fullscreen class='global-leaderboard-content'>
        <IonGrid>
          <IonRow class='ion-padding ion-text-center'>
            <IonCol className='ion-text-uppercase text-color-primary font-fredoka-one'>
              <IonIcon icon={trophy} class='global-leaderboard-icon'/>
              <h2 className='ion-no-margin'>PAPAN PERINGKAT</h2>
              <small>{startTime} - {endTime}</small>
            </IonCol>
          </IonRow>
        </IonGrid>

        {leaderboard && leaderboard.length > 0 && userCtx.user.length > 0 &&
          leaderboard.map((l, i) => (
            <IonItem lines='none' class={l.uid === userCtx.user[0].uid? 'global-leaderboard-item-user' : 'global-leaderboard-item'} key={i}
              style={{
                background: "url(assets/namecard/" + l.namecardImage + ") no-repeat center fixed",
                backgroundSize: "cover",
                backgroundColor: "var(--pickment-color-secondary)"
              }}
            >
              <IonGrid>
                <IonRow class='ion-align-items-center'>
                  <IonCol size='1' class='font-fredoka-one'>
                    {i + 1}
                  </IonCol>

                  <IonCol size='auto'>
                    <div
                      className='global-leaderboard-item-frame margin-lr-auto'
                      style={{
                        backgroundImage: "linear-gradient(#" + l.frameColor.substring(0, 6) + ", #" + l.frameColor.substring(6) + ")"
                      }}
                    >
                      <img src={'assets/avatar/' + l.avatarImage} className='global-leaderboard-item-avatar'/>
                    </div>
                  </IonCol>

                  <IonCol size='auto'>
                    {l.username}
                  </IonCol>

                  <IonCol size='auto'>
                    {l.badge1image !== "" &&
                      <img src={'assets/badge/' + l.badge1image} className='global-leaderboard-item-badge-1'/>
                    }
                    {l.badge2image !== "" &&
                      <img src={'assets/badge/' + l.badge2image} className='global-leaderboard-item-badge-2'/>
                    }
                  </IonCol>

                  <IonCol size='auto' class='global-leaderboard-item-float-right font-fredoka-one'>
                    {l.weeklyXp}
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonItem>
          ))
        }
      </IonContent>

      <IonFooter class='global-leaderboard-footer ion-no-border'>
        <IonItem lines='none' class='global-leaderboard-item-user'
          style={{
            background: "url(assets/namecard/" + namecardImage + ") no-repeat center fixed",
            backgroundSize: "cover",
            backgroundColor: "var(--pickment-color-secondary)"
          }}
        >
          <IonGrid>
            <IonRow class='ion-align-items-center'>
              <IonCol size='1' class='font-fredoka-one'>
                {rank}
              </IonCol>

              <IonCol size='auto'>
                <div
                  className='global-leaderboard-item-frame margin-lr-auto'
                  style={{
                    backgroundImage: "linear-gradient(#" + frameColor.substring(0, 6) + ", #" + frameColor.substring(6) + ")"
                  }}
                >
                  <img src={'assets/avatar/' + avatarImage} className='global-leaderboard-item-avatar'/>
                </div>
              </IonCol>

              <IonCol size='auto'>
                {username}
              </IonCol>

              <IonCol size='auto'>
                {badge1image === ""?
                  <div className='global-leaderboard-item-badge-1'></div>
                :
                  <img src={'assets/badge/' + badge1image} className='global-leaderboard-item-badge-1'/>
                }
                {badge2image === ""?
                  <div className='global-leaderboard-item-badge-2'></div>
                :
                  <img src={'assets/badge/' + badge2image} className='global-leaderboard-item-badge-2'/>
                }
              </IonCol>

              <IonCol size='auto' class='global-leaderboard-item-float-right font-fredoka-one'>
                {weeklyXp}
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>

        <IonGrid>
          <IonRow>
            <IonLabel class='margin-lr-auto'>
              <p>Direset dalam {dayCounter} hari {hourCounter} jam {minuteCounter} menit</p>
            </IonLabel>
          </IonRow>
        </IonGrid>
      </IonFooter>
    </IonPage>
  );
};

export default GlobalLeaderboard;
