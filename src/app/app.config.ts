import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { initializeApp } from "firebase/app";
import firebase from 'firebase/app';
import 'firebase/storage';
import{ AngularFireModule} from '@angular/fire/compat';
import{AngularFirestoreModule} from '@angular/fire/compat/firestore';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { initializeApp as initializeApp_alias, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyA_JlO-mpuzPpywPa8jPMPyrbwxUItanaQ",
  authDomain: "ecosystems-f5e54.firebaseapp.com",
  projectId: "ecosystems-f5e54",
  storageBucket: "ecosystems-f5e54.appspot.com",
  messagingSenderId: "404255347147",
  appId: "1:404255347147:web:876da615bc320a1399a64e",
  measurementId: "G-MJZYP8Y4Z4"
};
initializeApp(firebaseConfig);


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes,withHashLocation()),
    importProvidersFrom(HttpClient,
      AngularFireModule.initializeApp(firebaseConfig),
      AngularFireModule
    )
    ]
  };