// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMFbkEKLsMMVFTjgLAoCI5Z2QJUqdhhfg",
  authDomain: "sunny-b00bb.firebaseapp.com",
  projectId: "sunny-b00bb",
  storageBucket: "sunny-b00bb.appspot.com",
  messagingSenderId: "136850894147",
  appId: "1:136850894147:web:a620ee68f002c7229d13f6",
  measurementId: "G-83XG0KVWPS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };



auth.settings.appVerificationDisabledForTesting = true;


// Initialize Firebase
