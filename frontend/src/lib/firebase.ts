import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCXbis7wKU3IAcUrjyLTrVXKiIoW1CSpuM",
    authDomain: "codemande-d218d.firebaseapp.com",
    projectId: "codemande-d218d",
    storageBucket: "codemande-d218d.firebasestorage.app",
    messagingSenderId: "665960152507",
    appId: "1:665960152507:web:4e27850283a1065074989e",
    measurementId: "G-67XBBGTM1Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, googleProvider };
