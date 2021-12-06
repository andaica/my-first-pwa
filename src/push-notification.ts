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
  "BDIU-3YNHwKsFLSweba4SxJIs8A7wGZkUNW7AIbNtIYRkzqpMv0yuX9izR20zcetvORpcZ0Nia2FZJi1isOMC0g";

const app = initializeApp(firebaseConfig);

export const isSupportedPush = async () => {
  const pushSupported = await isSupported();
  console.log('Browser support push: ', pushSupported);
  return pushSupported;
};

let messaging: Messaging;
export const askForPermissionToReceiveNotifications = async () => {
  messaging = getMessaging(app);
  const token = await getToken(messaging, { vapidKey: vapidKey });
  if (token) {
    console.log('Your token is:', token);
  } else {
    alert("You must allow site to get notification!")
  }
  return token;
};

export const listenToNotify = (callback: (payload: any) => any) => {
  onMessage(messaging, (payload) => {
    console.log('Received foreground message: ', payload);
    callback(payload.data);
  });
};
