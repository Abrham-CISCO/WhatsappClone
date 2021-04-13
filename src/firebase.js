import firebase  from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyD5wyJNWjriLvR3H-e_pZ_s9L5YeDIAZd0",
  authDomain: "my-first-app-whatsapp-clone.firebaseapp.com",
  projectId: "my-first-app-whatsapp-clone",
  storageBucket: "my-first-app-whatsapp-clone.appspot.com",
  messagingSenderId: "871469579256",
  appId: "1:871469579256:web:1aec3d3e6079ca6a45340d"
};

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  export {auth, provider};
  export default db;