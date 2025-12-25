// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8wia_XWRGdTmpjXCmfmvPDF3tdNTyLfM",
  authDomain: "aruskas-app.firebaseapp.com",
  projectId: "aruskas-app",
  storageBucket: "aruskas-app.firebasestorage.app",
  messagingSenderId: "491358319250",
  appId: "1:491358319250:web:b70f67f4f54d1895c62c4b",
  measurementId: "G-FNXBDXZVYQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);