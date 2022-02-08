import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, isSupported, Messaging, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyBXTJmuNJw_cPvbuC-V9d-wyhKTEb1Oa0w',
  authDomain: 'my-pwa-64b36.firebaseapp.com',
  projectId: 'my-pwa-64b36',
  storageBucket: 'my-pwa-64b36.appspot.com',
  messagingSenderId: '326002942969',
  appId: '1:326002942969:web:c2d4cf7ea7cb80b1689328',
  measurementId: 'G-WR8CCZPX7J',
};
const vapidKey =
  'BDIU-3YNHwKsFLSweba4SxJIs8A7wGZkUNW7AIbNtIYRkzqpMv0yuX9izR20zcetvORpcZ0Nia2FZJi1isOMC0g';
const serverKey =
  'AAAAS-dKI_k:APA91bGKBR4NQSlqehLnLp2WzDkmpk4WkbbYSEavxcPltmVRsuZ-8MlVnc13B4dQlc2H8cBiE0gs_Rh2MJog7O9QVmZFtVQPUAzFW5_vGomgCk-tSbOOz_bGP8EyQUJ2gHp0fvcoByC6';

const app = initializeApp(firebaseConfig);

export const isSupportedPush = async () => {
  const pushSupported = await isSupported();
  console.log('Browser support push: ', pushSupported);
  return pushSupported;
};

let messaging: Messaging;
export const askForPermissionToReceiveNotifications = async () => {
  try {
    messaging = getMessaging(app);
    const token = await getToken(messaging, { vapidKey: vapidKey });
    if (token) {
      console.log('Your token is:', token);
    }
    return token;
  } catch (error) {
    if (Notification.permission !== 'granted') {
      alert('You must allow site to get notification!');
    }
    throw error;
  }
};

export const listenToNotify = (callback: (payload: any) => any) => {
  onMessage(messaging, (payload) => {
    console.log('Received foreground message: ', payload);
    callback(payload.data);
  });
};

export const subscribeTokenToTopic = async (token: string, topic: string) => {
  const response = await fetch(
    'https://iid.googleapis.com/iid/v1/' + token + '/rel/topics/' + topic,
    {
      method: 'POST',
      headers: new Headers({
        Authorization: 'key=' + serverKey,
      }),
    }
  );
  if (response.status < 200 || response.status >= 400) {
    throw 'Error subscribing to topic: ' + response.status + ' - ' + response.text();
  }
  console.log('Subscribed to "' + topic + '"');
  return true;
};

export const unSubscribeToTopic = async (token: string, topic: string) => {
  const response = await fetch('https://iid.googleapis.com/iid/v1:batchRemove', {
    method: 'POST',
    headers: new Headers({
      Authorization: 'key=' + serverKey,
    }),
    body: JSON.stringify({
      to: '/topics/' + topic,
      registration_tokens: [token],
    }),
  });
  if (response.status < 200 || response.status >= 400) {
    throw 'Error unSubscribing to topic: ' + response.status + ' - ' + response.text();
  }
  console.log('Unsubscribed to "' + topic + '"');
  return true;
};
