import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const app = firebase.initializeApp({
  apiKey: "AIzaSyB8oiV2NE6OdBz2eZvBYswmwFA-o16scMg",
  authDomain: "nanitblogfirebase.firebaseapp.com",
  projectId: "nanitblogfirebase",
  storageBucket: "nanitblogfirebase.appspot.com",
  messagingSenderId: "914294113604",
  appId: "1:914294113604:web:ae5664cb26b089ae424311",
  measurementId: "G-F9621WCW9C"
});

const db = getFirestore();

export { app, db };
