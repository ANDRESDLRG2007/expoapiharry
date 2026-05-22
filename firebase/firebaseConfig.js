import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCkGu-d_4NohTEbU-pVxGfvlBJlVVS1AuM",
  authDomain: "harryp-houses.firebaseapp.com",
  projectId: "harryp-houses",
  storageBucket: "harryp-houses.firebasestorage.app",
  messagingSenderId: "297919213680",
  appId: "1:297919213680:web:a21f8e91457235123244b5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };