// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "task-manager-661f1.firebaseapp.com",
  projectId: "task-manager-661f1",
  storageBucket: "task-manager-661f1.firebasestorage.app",
  messagingSenderId: "1059911669112",
  appId: "1:1059911669112:web:7f1ac121a4ffab348c648d",
  measurementId: "G-LWTZWYBT64"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);