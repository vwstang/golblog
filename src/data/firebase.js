import firebase from "firebase";
import fbaseConfig from "./secrets";

// Initialize Firebase
firebase.initializeApp(fbaseConfig);

// Authentication
export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();

// Node References
export const blogDBRef = firebase.database().ref("/blogs");
export const userDBRef = firebase.database().ref("/users");


export default firebase;
