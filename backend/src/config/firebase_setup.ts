// IMPORTANT: PLEASE Read the README before running the server to properly setup environment variables

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { collection } from "firebase/firestore";

// import { config } from 'dotenv';
// import * as path from 'path';
// import { firebaseConfigExport } from "./firebase_cfg";

// export const envPath: string = path.resolve(
//     __dirname,
//     '.env',
// );
// config({ path: envPath });

//TODO: Add a validation method to ensure that no config info is undefined on running the server
//TODO: Get the .env file working with Docker
export const firebaseConfigExport = {

};

type FirebaseCFGObject = {
    apiKey: string | undefined;
    authDomain: string | undefined;
    databaseURL: string | undefined;
    projectId: string | undefined;
    storageBucket: string | undefined;
    messagingSenderId: string | undefined;
    appId: string | undefined;
    measurementId: string | undefined;
}

type RuntimeInfo = {
    port: number | undefined;
}

export const firebaseConfig: FirebaseCFGObject = {
    apiKey: firebaseConfigExport.apiKey,
    authDomain: firebaseConfigExport.authDomain,
    databaseURL: firebaseConfigExport.databaseURL,
    projectId: firebaseConfigExport.projectId,
    storageBucket: firebaseConfigExport.storageBucket,
    messagingSenderId: firebaseConfigExport.messagingSenderId,
    appId: firebaseConfigExport.appId,
    measurementId: firebaseConfigExport.measurementId
}

export const runtimeObject: RuntimeInfo = {
    port: 8080
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("Finished initializing Firebase app")

// Access Firestore
export const db = getFirestore(app);
console.log("Finished setup for Firestore db => runtime")

// Setup port number
console.log(runtimeObject.port);