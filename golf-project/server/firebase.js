import { initializeApp } from 'firebase/app'; 

const firebaseConfig = {
    apiKey: "AIzaSyBjz2Fn1zx4rnJb1uldNVkAXGRyDRN5gI8",
    authDomain: "login-auth-8e5a9.firebaseapp.com",
    databaseURL: "https://login-auth-8e5a9-default-rtdb.firebaseio.com",
    projectId: "login-auth-8e5a9",
    storageBucket: "login-auth-8e5a9.appspot.com",
    messagingSenderId: "568739474039",
    appId: "1:568739474039:web:2d2dba8f18647f9bfdf472"
  
  };

  const app = initializeApp(firebaseConfig);

  export default app;
  
  