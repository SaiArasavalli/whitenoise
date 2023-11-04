import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { signOut } from 'firebase/auth';
import { Subscription } from 'rxjs';
import { auth } from 'src/app/firebase';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  loggedInStateSubscription: Subscription;
  adminStateSubscription: Subscription;
  isUserLoggedIn!: boolean;
  isAdmin!: boolean;

  constructor(private authService: AuthService, private router: Router) {
    this.loggedInStateSubscription = this.authService.loggedInState$.subscribe(
      (state) => {
        this.isUserLoggedIn = state;
      }
    );

    this.adminStateSubscription = this.authService.adminState$.subscribe(
      (state) => {
        this.isAdmin = state;
      }
    );
  }

  signOutUser() {
    signOut(auth)
      .then(() => {
        this.authService.updateLoggedInState(false);
        console.log('Logout Successful');
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
