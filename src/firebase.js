
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDcT3yh1gr9CXEvasuSysXaEMP999zXVdE",
  authDomain: "thepregames-820b5.firebaseapp.com",
  projectId: "thepregames-820b5",
  storageBucket: "thepregames-820b5.appspot.com",
  messagingSenderId: "221437646464",
  appId: "1:221437646464:web:8579731c0f4be020cbf865",
  measurementId: "G-4CLEKG0NLC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db;