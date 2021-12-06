import React, { useEffect, useState } from 'react';
import logo from './logo.png';
import './App.css';
import {
  askForPermissionToReceiveNotifications,
  isSupportedPush,
  listenToNotify,
} from './push-notification';

function App() {
  const [token, setToken] = useState('');
  const [isSupported, setSupported] = useState(false);

  useEffect(() => {
    isSupportedPush()
      .then((isSupported) => {
        if (isSupported) {
          setSupported(true);
          getFCMToken();
        }
      })
      .catch((error) => console.warn(error));
  }, []);

  const getFCMToken = async () => {
    try {
      const token = await askForPermissionToReceiveNotifications();
      if (token) {
        setToken(token);
        listenToNotify((messagePayload) => {
          alert(messagePayload.title + ': ' + messagePayload.body);
        });
      }
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>My first PWA!</p>
        {isSupported ? (
          <p style={{ wordBreak: 'break-word' }}>
            {token ? 'FCM Token: ' + token : 'You must allow this site to get notification!'}
          </p>
        ) : (
          <p>Your browser does not support push!</p>
        )}
        <button onClick={getFCMToken}>Regist to get notify!</button>
      </header>
    </div>
  );
}

export default App;
