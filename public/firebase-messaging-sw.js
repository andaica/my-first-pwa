importScripts('https://www.gstatic.com/firebasejs/9.5.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.5.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBXTJmuNJw_cPvbuC-V9d-wyhKTEb1Oa0w',
  authDomain: 'my-pwa-64b36.firebaseapp.com',
  projectId: 'my-pwa-64b36',
  storageBucket: 'my-pwa-64b36.appspot.com',
  messagingSenderId: '326002942969',
  appId: '1:326002942969:web:c2d4cf7ea7cb80b1689328',
  measurementId: 'G-WR8CCZPX7J',
});

const isSupported = firebase.messaging.isSupported();
if (isSupported) {
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage((payload) => {
    console.log('Received background message: ', payload);
    const { title, body } = payload.data;
    self.registration.showNotification(title, {
      body,
      icon: '/notify.png',
    });
  });

  self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    const promiseChain = clients.openWindow('https://annt-ows.xyz');
    event.waitUntil(promiseChain);
  });
}
