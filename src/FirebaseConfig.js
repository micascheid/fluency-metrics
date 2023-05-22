import { initializeApp } from "firebase/app";
import {getAuth, connectAuthEmulator} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// export declare function connectFirestoreEmulator(firestore: Firestore, host: string, port: number, options?: {
//   mockUserToken?: EmulatorMockTokenOptions | string;
// }): void;

//Enter the apikey and info provided by firebase below
const firebaseConfig = {
    apiKey: "AIzaSyASGbbJMemMQ7dgaA3UYv99cKkMtHTcoFs",
    authDomain: "fluencymetrics-34537.firebaseapp.com",
    projectId: "fluencymetrics-34537",
    storageBucket: "fluencymetrics-34537.appspot.com",
    messagingSenderId: "504932923085",
    appId: "1:504932923085:web:31441416636e8667b11b84",
    measurementId: "G-9X5WB2NYLT"
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

connectFirestoreEmulator(db, 'localhost', 8080);
const auth = getAuth(app);
connectAuthEmulator(auth, "http://localhost:9099");
// Export firestore database
// It will be imported into your react app whenever it is needed

export { db, auth };