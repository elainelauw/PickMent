import { IonButton, IonCol, IonContent, IonFooter, IonGrid, IonIcon, IonItem, IonPage, IonRow, NavContext } from '@ionic/react';
import { trophy } from 'ionicons/icons';
import { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import UserContext from '../data/user-context';

import './GameLeaderboard.css';

const GameLeaderboard: React.FC = () => {
  const userCtx = useContext(UserContext);
  const { id } = useParams<{ id: string }>();

  const { navigate } = useContext(NavContext);

  const redirect = useCallback(
		() => navigate('/welcome'),
		[navigate]
	);

  const redirect404 = useCallback(
		() => navigate('/404'),
		[navigate]
	);

  const [showIllustration, setShowIllustration] = useState(false);

  const [leaderboard, setLeaderboard] = useState<Array<any>>([]);

  useEffect(() => {
    if(
      window.location.href.split('#')[1] &&
      window.location.href.split('#')[1] === "showIllustration"
    ) {
      setShowIllustration(true);
    }
	}, []);

  const [rank, setRank] = useState("-");
  const [username, setUsername] = useState("username");
  const [avatarImage, setAvatarImage] = useState("Pemain.png");
  const [frameColor, setFrameColor] = useState("ffffffffffff");
  const [namecardImage, setNamecardImage] = useState("Pemain.jpg");
  const [badge1image, setBadge1image] = useState("");
  const [badge2image, setBadge2image] = useState("");
  const [score, setScore] = useState("0");
  const [participation, setParticipation] = useState(0);

	useEffect(() => {
		if(userCtx.user.length === 0) {
      redirect();
    }
    else {
      if(userCtx.user[0].uid != -1) {
        const formData = new FormData();

        formData.append('uid', userCtx.user[0].uid.toString());
        formData.append('id', id);

        axios.post("http://localhost/PickMent/getGameLeaderboard.php", formData).then(res => {
          if(res.data.found === 0) {
            redirect404();
          }
          else {
            setRank(res.data.rank);
            setUsername(res.data.username);
            setAvatarImage(res.data.avatarImage);
            setFrameColor(res.data.frameColor);
            setNamecardImage(res.data.namecardImage);
            setBadge1image(res.data.badge1image);
            setBadge2image(res.data.badge2image);
            setScore(res.data.score);
            setParticipation(parseInt(res.data.participation));

            setLeaderboard(res.data.leaderboard);
          }
        });
      }
    }
	}, [userCtx]);

  return (
    <IonPage>
      <IonContent class='game-leaderboard-content' fullscreen>
        <IonGrid class='game-leaderboard-grid ion-no-padding'>
          <IonRow class='game-leaderboard-row'>
            <IonRow class='game-leaderboard-row-gradient ion-align-items-center'>
              <IonCol>
                <IonRow class='ion-padding'>
                  <img src='assets/icon/PickMent.png' className='game-leaderboard-logo margin-lr-auto'/>
                </IonRow>

                <IonRow class='ion-padding ion-text-center'>
                  <IonCol>
                    <IonRow>
                      <IonCol class='margin-lr-auto'>
                        <h2 className='font-fredoka-one text-color-primary'>
                          SKOR AKHIR<br/>
                          #{id.padStart(6, '0')}
                        </h2>
                      </IonCol>
                    </IonRow>

                    <IonRow>
                      <img src='assets/icon/LR Arrow Yellow.gif' className='game-leaderboard-score-arrow-left'/>
                      <p className='game-leaderboard-score font-fredoka-one'>{score}</p>
                      <img src='assets/icon/RL Arrow Yellow.gif' className='game-leaderboard-score-arrow-right'/>
                    </IonRow>
                  </IonCol>
                </IonRow>

                <IonRow class='ion-padding-top ion-padding-bottom'>
                  <IonCol>
                  <IonGrid>
                    <IonRow class='ion-padding ion-text-center'>
                      <IonCol className='ion-text-uppercase text-color-primary font-fredoka-one'>
                        <IonIcon icon={trophy} class='game-leaderboard-icon'/>
                        <h2 className='ion-no-margin'>PAPAN PERINGKAT</h2>
                      </IonCol>
                    </IonRow>
                  </IonGrid>

                  {leaderboard && leaderboard.length > 0 && userCtx.user.length > 0 &&
                    leaderboard.map((l, i) => (
                      <IonItem lines='none' class={l.uid === userCtx.user[0].uid? 'game-leaderboard-item-user' : 'game-leaderboard-item'} key={i}
                        style={{
                          backgroundImage: "url(assets/namecard/" + l.namecardImage + ")",
                          backgroundPosition: "0 100%",
                          backgroundRepeat: "no-repeat",
                          backgroundAttachment: "fixed",
                          backgroundSize: "cover"
                        }}
                      >
                        <IonGrid>
                          <IonRow class='ion-align-items-center'>
                            <IonCol size='1' class='font-fredoka-one'>
                              {l.rank}
                            </IonCol>

                            <IonCol size='auto' class='game-leaderboard-col'>
                              <div
                                className='game-leaderboard-item-frame margin-lr-auto'
                                style={{
                                  backgroundImage: "linear-gradient(#" + l.frameColor.substring(0, 6) + ", #" + l.frameColor.substring(6) + ")"
                                }}
                              >
                                <img src={'assets/avatar/' + l.avatarImage} className='game-leaderboard-item-avatar'/>
                              </div>
                            </IonCol>

                            <IonCol size='auto' class='game-leaderboard-col'>
                              {l.username}
                            </IonCol>

                            <IonCol size='auto' class='game-leaderboard-col'>
                              {l.badge1image !== "" &&
                                <img src={'assets/badge/' + l.badge1image} className='game-leaderboard-item-badge-1'/>
                              }
                              {l.badge2image !== "" &&
                                <img src={'assets/badge/' + l.badge2image} className='game-leaderboard-item-badge-2'/>
                              }
                            </IonCol>

                            <IonCol size='auto' class='game-leaderboard-item-float-right font-fredoka-one'>
                              {l.score}
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                      </IonItem>
                    ))
                  }

                    <IonItem style={{opacity: "0"}} class='game-leaderboard-item'>
                      <IonGrid>
                        <IonRow class='ion-align-items-center'>
                          <IonCol size='1' class='font-fredoka-one'>
                          </IonCol>

                          <IonCol size='auto' class='game-leaderboard-col'>
                            <div className='game-leaderboard-item-frame margin-lr-auto'>
                              <img className='game-leaderboard-item-avatar'/>
                            </div>
                          </IonCol>

                          <IonCol size='auto' class='game-leaderboard-col'>
                          </IonCol>

                          <IonCol size='auto' class='game-leaderboard-col'/>

                          <IonCol size='auto' class='game-leaderboard-item-float-right font-fredoka-one'>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonItem>
                  </IonCol>
                </IonRow>
              </IonCol>
            </IonRow>
          </IonRow>
        </IonGrid>
      </IonContent>

      <IonFooter class='game-leaderboard-footer ion-no-border'>
        <IonItem lines='none' class='game-leaderboard-item-user'
          style={{
            backgroundImage: "url(assets/namecard/" + namecardImage + ")",
            backgroundPosition: "0 100%",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
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
                  className='game-leaderboard-item-frame margin-lr-auto'
                  style={{
                    backgroundImage: "linear-gradient(#" + frameColor.substring(0, 6) + ", #" + frameColor.substring(6) + ")"
                  }}
                >
                  <img src={'assets/avatar/' + avatarImage} className='game-leaderboard-item-avatar'/>
                </div>
              </IonCol>

              <IonCol size='auto'>
                {username}
              </IonCol>

              <IonCol size='auto'>
                {badge1image !== "" && <img src={'assets/badge/' + badge1image} className='game-leaderboard-item-badge-1'/>}
                {badge2image !== "" && <img src={'assets/badge/' + badge2image} className='game-leaderboard-item-badge-2'/>}
              </IonCol>

              <IonCol size='auto' class='game-leaderboard-item-float-right font-fredoka-one'>
                {score}
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>

        <IonGrid>
          <IonRow class='ion-padding-bottom ion-text-center'>
            <IonButton href={showIllustration && participation <= 30? '\\illustration#showEffect' : '\\home'} class='margin-lr-auto button-long-primary-outline' color='outline'>{showIllustration && participation <= 30? 'Lanjut' : 'Kembali ke Menu Utama'}</IonButton>
          </IonRow>
        </IonGrid>
      </IonFooter>
    </IonPage>
  );
};

export default GameLeaderboard;
