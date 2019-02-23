import firebase from "firebase";
import fbaseConfig from "./secrets";

// Initialize Firebase
firebase.initializeApp(fbaseConfig);

export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();

export default firebase;
