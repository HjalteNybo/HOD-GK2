// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1fBV0n2dPeesaCOESsBufgZNtK0zZH9o",
  authDomain: "hod-festival-93df0.firebaseapp.com",
  projectId: "hod-festival-93df0",
  storageBucket: "hod-festival-93df0.firebasestorage.app",
  messagingSenderId: "404700981303",
  appId: "1:404700981303:web:0598acf661a03c5475b7b2"
};

const app = initializeApp(firebaseConfig);

// Persistér login i RN
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});


export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});



export const storage = getStorage(app);