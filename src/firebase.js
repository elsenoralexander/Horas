import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración pública de Firebase. Es seguro exponerla en aplicaciones cliente.
// Evitamos variables de entorno para no perderlas al usar git pull en otros PCs
const firebaseConfig = {
    apiKey: "AIzaSyAZzKUUI0alKOBReKrPUztQd1VmrcOO3sA",
    authDomain: "horas-six.firebaseapp.com",
    projectId: "horas-six",
    storageBucket: "horas-six.firebasestorage.app",
    messagingSenderId: "900275415335",
    appId: "1:900275415335:web:0bdd9f40e0f9094599a102"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
