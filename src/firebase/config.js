import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAwZOKnh0_-kP1BIsV222CgUn5NDlxf9P8",
  authDomain: "kettlebell-tracker-e1cdf.firebaseapp.com",
  projectId: "kettlebell-tracker-e1cdf",
  storageBucket: "kettlebell-tracker-e1cdf.firebasestorage.app",
  messagingSenderId: "800739641352",
  appId: "1:800739641352:web:a8212edfe41ccf62a729bd",
  measurementId: "G-P3VGXMWYEQ",
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)