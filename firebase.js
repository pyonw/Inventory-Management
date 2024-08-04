// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDy5ZtoEwK9JLsNuQztqZgxPkYjxrdWnXY",
  authDomain: "inventory-management-dada8.firebaseapp.com",
  projectId: "inventory-management-dada8",
  storageBucket: "inventory-management-dada8.appspot.com",
  messagingSenderId: "825241648937",
  appId: "1:825241648937:web:758542213cfd1b9aedc138",
  measurementId: "G-0GHXSK0CM2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}