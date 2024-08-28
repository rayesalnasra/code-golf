// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// firebase authentication tutorial: https://www.youtube.com/watch?v=GE27BkUZbXk

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjz2Fn1zx4rnJb1uldNVkAXGRyDRN5gI8",
  authDomain: "login-auth-8e5a9.firebaseapp.com",
  projectId: "login-auth-8e5a9",
  storageBucket: "login-auth-8e5a9.appspot.com",
  messagingSenderId: "568739474039",
  appId: "1:568739474039:web:c8773de500d19739fdf472",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export default app;
