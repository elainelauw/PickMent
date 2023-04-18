import { IonCol, IonContent, IonGrid, IonIcon, IonLabel, IonModal, IonPage, IonProgressBar, IonRippleEffect, IonRow, NavContext } from '@ionic/react';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';

import UserContext from '../data/user-context';

import './Play.css';

const Play: React.FC = () => {
  const userCtx = useContext(UserContext);
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const { navigate } = useContext(NavContext);

  const redirect = useCallback(
		() => navigate('/welcome'),
		[navigate]
	);

  const redirect404 = useCallback(
		() => navigate('/404'),
		[navigate]
	);

  const redirectLeaderboard = useCallback(
		() => navigate('/leaderboard/' + id),
		[navigate]
	);

  const [x, setX] = useState(0);

  const [gameData, setGameData] = useState<Array<any>>([]);

  const [correctCounter, setCorrectCounter] = useState(0);

  const [achievement6, setAchievement6] = useState("0");
  const [achievement7, setAchievement7] = useState("0");
  
  const [answerData, setAnswerData] = useState<Array<any>>([]);

	useEffect(() => {
    if(userCtx.user.length === 0) {
      redirect();
    }
    else {
      if(!/^[0-9]*$/.test(id)) {
        redirect404();
      }
      else {
        if(userCtx.user[0].uid != -1) {
          const formData = new FormData();

          formData.append('uid', userCtx.user[0].uid.toString());
          formData.append('id', id);

          axios.post("http://localhost/PickMent/getGameData.php", formData).then(res => {
            if(res.data.found === 0) {
              redirect404();
            }
            else {
              if(res.data.done === 1) {
                redirectLeaderboard();
              }
              else {
                if(res.data.completed === 1) {
                  redirect404();
                }
                else {
                  setGameData(res.data.gameData);
                }
              }
            }
          });
        }
      }
    }
	}, [userCtx]);

  const [isModalShown, setIsModalShown] = useState(false);
  const [modalPoint, setModalPoint] = useState(0);

  const answerHandler = (answer: Number) => {
    if(x < gameData.length) {
      var positiveResult = answer === 1? gameData[x].positive + 1 : gameData[x].positive;
      var neutralResult = answer === 0? gameData[x].neutral + 1 : gameData[x].neutral;
      var negativeResult = answer === -1? gameData[x].negative + 1 : gameData[x].negative;

      var maxResult = Math.max(positiveResult, neutralResult, negativeResult);
      var correct = true;

      if(answer === 1 && (neutralResult === maxResult || negativeResult === maxResult)) {
        correct = false;
      }

      if(answer === 0 && (positiveResult === maxResult || negativeResult === maxResult)) {
        correct = false;
      }

      if(answer === -1 && (positiveResult === maxResult || neutralResult === maxResult)) {
        correct = false;
      }

      var points = 0;

      if(correct) {
        points = 5 + (correctCounter + 1);

        if(correctCounter + 1 === 10) {
          setAchievement6("1");
        }
    
        if(correctCounter + 1 === 20) {
          setAchievement7("1");
        }
        
        setCorrectCounter(correctCounter + 1);
      }
      else {
        setCorrectCounter(0);
      }

      setAnswerData(current => [...current, {
        id: gameData[x].id,
        sentiment: answer,
        points: points
      }]);

      setModalPoint(points);
      setIsModalShown(true);

      setX(x + 1);
    }
	}

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if(isModalShown === true) {
      const interval = setInterval(() => {
        setProgress((prevProgress) => prevProgress + 0.01);
      }, 25);
      return () => clearInterval(interval);
    }
  }, [isModalShown]);

  if(progress > 1) {
    setTimeout(() => {
      setIsModalShown(false);
      setProgress(0);
    }, 0);
  }

  useEffect(() => {
    if(gameData.length > 0 && answerData.length === gameData.length && progress > 1) {
      console.log(answerData);
      const formData = new FormData();

      formData.append('uid', userCtx.user[0].uid.toString());
      formData.append('id', id);
      formData.append('answerData', JSON.stringify(answerData));
      formData.append('achievement6', achievement6);
      formData.append('achievement7', achievement7);

      axios.post("http://localhost/PickMent/addLabelData.php", formData).then(res => {
        history.replace('/leaderboard/' + id + '#showIllustration');
      });
    }
	}, [answerData, progress]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonModal
          isOpen={isModalShown}
          onDidDismiss={() => setIsModalShown(false)}
          class='play-modal'
        >
          <IonContent class={modalPoint === 0? 'play-modal-content-incorrect' : 'play-modal-content-correct'}>
            <IonProgressBar value={progress} color="light" class='play-modal-progress-bar'/>
            <IonGrid class='play-modal-grid ion-padding'>
              <IonRow class='play-modal-row ion-padding-bottom ion-align-items-center'>
                <IonCol class='ion-padding-bottom'>
                  <IonRow>
                    <IonIcon icon={modalPoint === 0? closeCircle : checkmarkCircle} class='play-modal-icon margin-lr-auto'/>
                  </IonRow>

                  {modalPoint === 0?
                    <>
                      <IonRow>
                        <p className='margin-lr-auto ion-text-center'>Pilihan Anda berbeda dari suara mayoritas: Kemenangan beruntun berakhir...</p>
                      </IonRow>

                      <IonRow class='ion-padding'>
                        <h1 className='font-fredoka-one margin-lr-auto'>+{modalPoint} point</h1>
                      </IonRow>
                    </>
                  :
                    <>
                      <IonRow>
                        <p className='margin-lr-auto ion-text-center'>Pilihan Anda paling banyak dipilih: Anda menang {correctCounter} kali beruntun!</p>
                      </IonRow>

                      <IonRow class='ion-padding'>
                        <h1 className='font-fredoka-one margin-lr-auto'>+{modalPoint} point</h1>
                      </IonRow>
                    </>
                  }
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
        </IonModal>

        {gameData && gameData.length > 0 && x < gameData.length &&
          <IonGrid class='play-grid ion-no-padding'>
            <IonRow class='play-row-question ion-align-items-center'>
              <IonCol class='play-col ion-padding'>
                <h2 className='play-question-number font-fredoka-one text-color-primary'>Q{x + 1}.</h2>
                
                <p className='play-question-text text-color-secondary'>
                  {gameData[x].data}
                </p>
                
                <IonLabel class='play-question-label'>
                  <p>{x + 1}/{gameData.length}</p>
                </IonLabel>
              </IonCol>
            </IonRow>

            <IonRow class='play-row-positive ion-align-items-center ion-activatable cursor-pointer'>
              <IonCol class='play-col' onClick={() => answerHandler(1)}>
                <img src={'assets/icon/PickMent.png'} className='play-answer-icon ion-padding'/>
                <IonRippleEffect/>
              </IonCol>
            </IonRow>

            <IonRow class='play-row-neutral ion-align-items-center ion-activatable cursor-pointer'>
              <IonCol class='play-col' onClick={() => answerHandler(0)}>
                <img src={'assets/icon/PickMent.png'} className='play-answer-icon ion-padding'/>
                <IonRippleEffect/>
              </IonCol>
            </IonRow>

            <IonRow class='play-row-negative ion-align-items-center ion-activatable cursor-pointer'>
              <IonCol class='play-col' onClick={() => answerHandler(-1)}>
                <img src={'assets/icon/PickMent.png'} className='play-answer-icon ion-padding'/>
                <IonRippleEffect/>
              </IonCol>
            </IonRow>
          </IonGrid>
        }
      </IonContent>
    </IonPage>
  );
};

export default Play;
