import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBInOzuG73dFeIzfhEVUCQ3d1odD4xgkXE',
  authDomain: 'wnsnookerhub.firebaseapp.com',
  projectId: 'wnsnookerhub',
  storageBucket: 'wnsnookerhub.appspot.com',
  messagingSenderId: '260781427792',
  appId: '1:260781427792:web:bb52bdd544553e67591555',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
