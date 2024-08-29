// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// firebase authentication tutorial: https://www.youtube.com/watch?v=GE27BkUZbXk

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey and other config here - William has info
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export default app;
