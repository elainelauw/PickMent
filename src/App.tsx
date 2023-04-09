import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useContext, useEffect } from 'react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import UserContext from './data/user-context';

import Error404 from './pages/Error404';

import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';

import Home from './pages/Home';
import Notification from './pages/Notification';
import Archive from './pages/Archive';
import Profile from './pages/Profile';
import About from './pages/About';

import EditProfile from './pages/EditProfile';
import EditInfo from './pages/EditInfo';

setupIonicReact();

const App: React.FC = () => {
  const userCtx = useContext(UserContext);
  const {initContext} = userCtx;

  useEffect(() => {
    initContext();
  }, [initContext]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet id="main">
          <Route component={Error404}/>

          <Route exact path="/">
            <Redirect to="/home"/>
          </Route>

          <Route exact path="/welcome">
            <Welcome/>
          </Route>
          
          <Route exact path="/login">
            <Login/>
          </Route>
          
          <Route exact path="/register">
            <Register/>
          </Route>

          <Route exact path="/home">
            <Home/>
          </Route>

          <Route exact path="/notification">
            <Notification/>
          </Route>

          <Route exact path="/archive">
            <Archive/>
          </Route>

          <Route exact path="/profile">
            <Profile/>
          </Route>

          <Route exact path="/editProfile">
            <EditProfile/>
          </Route>

          <Route exact path="/editInfo">
            <EditInfo/>
          </Route>

          <Route exact path="/about">
            <About/>
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
};

export default App;
