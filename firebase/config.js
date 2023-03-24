import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_API_ID,
//   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyDVVHPYVfJ19hskraQsd91iHRmG37_UrCY",
  authDomain: "mobile-app-c0481.firebaseapp.com",
  projectId: "mobile-app-c0481",
  storageBucket: "mobile-app-c0481.appspot.com",
  messagingSenderId: "209278367906",
  appId: "1:209278367906:web:c867ec622fc34c860bbffb",
  measurementId: "G-LNH4GWM691",
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

//Init authorization
// export const auth = getAuth(app);

//Init Firestore database
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
