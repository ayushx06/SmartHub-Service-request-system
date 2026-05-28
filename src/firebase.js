import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAvF2j6Keo90Dbgm4L92PK2DujyFqWT8cw",
    authDomain: "smarthub-39d0e.firebaseapp.com",
    projectId: "smarthub-39d0e",
    storageBucket: "smarthub-39d0e.firebasestorage.app",
    messagingSenderId: "551834144328",
    appId: "1:551834144328:web:cfcc5c7e16c3417e4a127d"
  };

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
