import { Injectable, signal, computed } from '@angular/core';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';

export type UserRole = 'anonymous' | 'user' | 'admin';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<AppUser | null>(null);
  private _loading = signal(true);

  readonly user = this._user.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);
  readonly isAdmin = computed(() => this._user()?.role === 'admin');
  readonly role = computed(() => this._user()?.role ?? 'anonymous');

  constructor(private firebase: FirebaseService) {
    onAuthStateChanged(this.firebase.auth, async (firebaseUser) => {
      if (firebaseUser) {
        const appUser = await this.buildAppUser(firebaseUser);
        this._user.set(appUser);
      } else {
        this._user.set(null);
      }
      this._loading.set(false);
    });
  }

  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.firebase.auth, provider);
    await this.ensureUserDocument(result.user);
  }

  async logout(): Promise<void> {
    await signOut(this.firebase.auth);
  }

  private async buildAppUser(firebaseUser: User): Promise<AppUser> {
    const role = await this.getUserRole(firebaseUser.uid);
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      role,
    };
  }

  private async getUserRole(uid: string): Promise<UserRole> {
    try {
      const snap = await getDoc(doc(this.firebase.db, 'users', uid));
      if (snap.exists()) {
        return (snap.data()['role'] as UserRole) ?? 'user';
      }
      return 'user';
    } catch {
      return 'user';
    }
  }

  private async ensureUserDocument(firebaseUser: User): Promise<void> {
    const ref = doc(this.firebase.db, 'users', firebaseUser.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        role: 'user',
        createdAt: new Date().toISOString(),
      });
    }
  }
}
