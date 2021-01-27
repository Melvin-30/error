//import * as firebase from 'firebase'
//require('@firebase/firestore')
import firebase from 'firebase/app'
import '@firebase/firestore'
import 'firebase/storage'
import 'firebase/analytics'

  // Your web app's Firebase configuration
 
  var firebaseConfig = {
    apiKey: "AIzaSyBixwAWpklglC1LMBCtXDGAW-fbJmHq8y4",
    authDomain: "willy-21cd0.firebaseapp.com",
    projectId: "willy-21cd0",
    storageBucket: "willy-21cd0.appspot.com",
    messagingSenderId: "521738228972",
    appId: "1:521738228972:web:a3a99f6e6d0060bf3001c9"
  };
  // Initialize Firebase
  //if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
  //}
  

  export default firebase.firestore();
