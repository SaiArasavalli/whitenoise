import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from 'src/app/firebase';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  error: boolean = false;
  submitting: boolean = false;
  signInForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}
  signInUser(credentails: any) {
    if (this.signInForm.valid) {
      this.submitting = true;
      signInWithEmailAndPassword(auth, credentails.email, credentails.password)
        .then((userCredential) => {
          this.authService.updateLoggedInState(true);
          if (userCredential.user.email) {
            this.authService.updateAdminState(userCredential.user.email);
          }
          this.signInForm.reset();
          this.submitting = false;
          this.router.navigate(['/']);
          console.log('Login Successful.');
        })
        .catch((error) => {
          this.error = true;
          console.log(error);
          this.submitting = false;
        });
    }
  }
}
