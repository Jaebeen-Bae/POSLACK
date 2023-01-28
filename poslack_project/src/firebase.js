import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBSjCs_tNWlEKFUh77TOJjazubb6v9mWPc",
  authDomain: "poslack-react.firebaseapp.com",
  databaseURL: "https://poslack-react-default-rtdb.firebaseio.com",
  projectId: "poslack-react",
  storageBucket: "poslack-react.appspot.com",
  messagingSenderId: "558053467436",
  appId: "1:558053467436:web:6345787d30dbe26cd2f889",
  measurementId: "G-YDJ88NLXW8"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export default firebase
