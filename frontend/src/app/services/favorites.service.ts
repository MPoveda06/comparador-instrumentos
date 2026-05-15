import { Injectable, signal } from '@angular/core';
import {
  doc, collection, setDoc, deleteDoc,
  getDocs, onSnapshot
} from 'firebase/firestore';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private _favorites = signal<Set<string>>(new Set());
  readonly favorites = this._favorites.asReadonly();

  constructor(private firebase: FirebaseService, private auth: AuthService) {
    // Escucha cambios en tiempo real cuando el usuario está logueado
    let unsub: (() => void) | null = null;

    // Reacciona a cambios de sesión
    setInterval(() => {
      const user = this.auth.user();
      if (user && !unsub) {
        const ref = collection(this.firebase.db, 'users', user.uid, 'favorites');
        unsub = onSnapshot(ref, snap => {
          const ids = new Set(snap.docs.map(d => d.id));
          this._favorites.set(ids);
        });
      } else if (!user && unsub) {
        unsub();
        unsub = null;
        this._favorites.set(new Set());
      }
    }, 500);
  }

  isFavorite(instrumentId: string): boolean {
    return this._favorites().has(instrumentId);
  }

  async toggle(instrumentId: string): Promise<void> {
    const user = this.auth.user();
    if (!user) return;

    const ref = doc(this.firebase.db, 'users', user.uid, 'favorites', instrumentId);
    if (this.isFavorite(instrumentId)) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, { addedAt: new Date().toISOString() });
    }
  }

  async getFavoriteIds(): Promise<string[]> {
    const user = this.auth.user();
    if (!user) return [];
    const snap = await getDocs(collection(this.firebase.db, 'users', user.uid, 'favorites'));
    return snap.docs.map(d => d.id);
  }
}
