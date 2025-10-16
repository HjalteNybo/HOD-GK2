import { initializeApp, getApp, getApps, SDK_VERSION as FB_SDK_VERSION } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyD1fBV0n2dPeesaCOESsBufgZNtK0zZH9o',
  authDomain: 'hod-festival-93df0.firebaseapp.com',
  projectId: 'hod-festival-93df0',
  storageBucket: 'hod-festival-93df0.firebasestorage.app',
  messagingSenderId: '404700981303',
  appId: '1:404700981303:web:0598acf661a03c5475b7b2',
};

let app;
try {
  // Brug eksisterende hvis den findes
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
} catch (e) {
  // Fald tilbage hvis nogen anden init’er samtidig
  if (e?.code === 'app/duplicate-app') {
    app = getApp();
  } else {
    throw e;
  }
}

// Debug: vis hvilken config der faktisk er aktiv nu
if (__DEV__) {
  console.log('[cfg] sdk =', FB_SDK_VERSION);
  console.log('[cfg] projectId(active) =', app.options.projectId);
  console.log('[cfg] storageBucket(active) =', app.options.storageBucket);
  // Advar hvis eksisterende app i memory ikke matcher denne fils config
  if (app.options.storageBucket !== firebaseConfig.storageBucket) {
    console.warn('[cfg] WARNING: existing app has storageBucket =', app.options.storageBucket,
      'but this file expects =', firebaseConfig.storageBucket,
      '→ Find anden initializeApp, der kører først.');
  }
}

// Auth (RN persistence)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore (RN-friendly transport)
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

// Storage – brug korrekt gs:// bucket eksplicit
export const storage = getStorage(app, 'gs://hod-festival-93df0.firebasestorage.app');