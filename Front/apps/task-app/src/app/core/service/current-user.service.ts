import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CurrentUser {
  nom: string;
  prenom: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private userSubject = new BehaviorSubject<CurrentUser | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        this.userSubject.next(user);
      } catch (e) {
        console.error('Erreur chargement utilisateur:', e);
      }
    }
  }

  setUser(user: CurrentUser): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.userSubject.next(user);
  }

  getUser(): CurrentUser | null {
    return this.userSubject.value;
  }

  hasUser(): boolean {
    return this.userSubject.value !== null;
  }

  clearUser(): void {
    localStorage.removeItem('currentUser');
    this.userSubject.next(null);
  }
}
