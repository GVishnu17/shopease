import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAQksD92ldU6nQcdxT7N_LdEs_PzgiOJHw",
  authDomain: "shopease-8420e.firebaseapp.com",
  projectId: "shopease-8420e",
  storageBucket: "shopease-8420e.firebasestorage.app",
  messagingSenderId: "80386053314",
  appId: "1:80386053314:web:442c00406b4d00c177575b",
  measurementId: "G-SZ4DMR366K"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
