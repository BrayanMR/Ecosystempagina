import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { initializeApp } from "firebase/app";
import { AngularFireModule } from '@angular/fire/compat';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

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
  providers: [
    provideRouter(routes, withHashLocation()),
    provideHttpClient(),
    importProvidersFrom(
      AngularFireModule.initializeApp(firebaseConfig),
      AngularFireModule
    )
  ]
};