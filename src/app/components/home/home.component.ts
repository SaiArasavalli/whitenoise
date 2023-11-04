import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
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
}
