import React, { useEffect, useState } from 'react';
import logo from './logo.png';
import './App.css';
import {
  askForPermissionToReceiveNotifications,
  isSupportedPush,
  listenToNotify,
  subscribeTokenToTopic,
  unSubscribeToTopic,
} from './push-notification';

function App() {
  const [token, setToken] = useState('');
  const [isSupported, setSupported] = useState(false);
  const [subcribed, setSubcribed] = useState(false);

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

        const result = await subscribeTokenToTopic(token, 'andaica');
        if (result) alert('You will receive notify soon!');

        listenToNotify((messagePayload) => {
          alert(messagePayload.title + ': ' + messagePayload.body);
        });
        setSubcribed(true);
      } else {
        alert('You not have FCM token to receive message!');
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const stopReceiveNoti = async () => {
    try {
      const result = await unSubscribeToTopic(token, 'andaica');
      setSubcribed(false);
      if (result) alert('You stop receive notify!');
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
        <button style={{ width: '160px' }} disabled={!subcribed} onClick={stopReceiveNoti}>
          Stop get notify!
        </button>
      </header>
    </div>
  );
}

export default App;
