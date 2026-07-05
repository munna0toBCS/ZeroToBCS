import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBloKKYphIyP8jep74BvVzPUSoVt7_srd0",
  authDomain: "zerotobcs-b318e.firebaseapp.com",
  projectId: "zerotobcs-b318e",
  storageBucket: "zerotobcs-b318e.firebasestorage.app",
  messagingSenderId: "17219319375",
  appId: "1:17219319375:web:2768ea7b5b57256e31dc3a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);