import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../state/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit, OnDestroy {
  email: string;
  password: string;

  private sub: Subscription;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.sub = this.authService.sync().subscribe();
  }

  onSignIn() {
    this.authService.signin(this.email, this.password).catch(error => {
      let errorMessage: string;

      switch (error.code) {
        case 'auth/wrong-password':
          errorMessage = 'Wrong password';
          break;
        case 'auth/user-not-found':
          errorMessage = "User with this e-mail doesn't exist";
          break;
        default:
          console.log(error);
          errorMessage = 'Unknown error';
      }
      // idk?
    });

    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
