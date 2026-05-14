import { Injectable } from '@angular/core';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBcyt03ocq903xx8BevHtBS6FmsolT5YXY',
  authDomain: 'tfc-musica-marcos.firebaseapp.com',
  projectId: 'tfc-musica-marcos',
  storageBucket: 'tfc-musica-marcos.firebasestorage.app',
  messagingSenderId: '378406022981',
  appId: '1:378406022981:web:d719d232e87e51f4b2d82c',
};

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  readonly app: FirebaseApp;
  readonly auth: Auth;
  readonly db: Firestore;

  constructor() {
    this.app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
  }
}
