import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { provideRouter } from '@angular/router';

import { routes } from './app/app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';
import { getVertexAI, provideVertexAI } from '@angular/fire/vertexai-preview';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    ...appConfig.providers,
    provideFirebaseApp(() => initializeApp({
      projectId: "ecosystems-f5e54",
      appId: "1:404255347147:web:876da615bc320a1399a64e",
      storageBucket: "ecosystems-f5e54.appspot.com",
      apiKey: "AIzaSyA_JlO-mpuzPpywPa8jPMPyrbwxUItanaQ",
      authDomain: "ecosystems-f5e54.firebaseapp.com",
      messagingSenderId: "404255347147",
      measurementId: "G-MJZYP8Y4Z4"
    })),
    provideAuth(() => getAuth()),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    UserTrackingService,
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideStorage(() => getStorage()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideVertexAI(() => getVertexAI()), provideAnimationsAsync()
  ]
}).catch((err) => console.error(err));
