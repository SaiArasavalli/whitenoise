import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn = localStorage.getItem('loggedIn') === 'true';
  private isUserLoggedIn = new BehaviorSubject<boolean>(this.loggedIn);
  loggedInState$: Observable<boolean> = this.isUserLoggedIn.asObservable();

  admin = localStorage.getItem('isAdmin') === 'true';
  private isAdmin = new BehaviorSubject<boolean>(this.admin);
  adminState$: Observable<boolean> = this.isAdmin.asObservable();

  constructor() {}

  updateLoggedInState(newState: any) {
    localStorage.setItem('loggedIn', newState.toString());
    this.isUserLoggedIn.next(newState);
  }

  updateAdminState(newState: string) {
    if (newState.includes('admin')) {
      localStorage.setItem('isAdmin', true.toString());
      this.isAdmin.next(true);
    } else {
      localStorage.setItem('isAdmin', false.toString());
      this.isAdmin.next(false);
    }
  }
}
