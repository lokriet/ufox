import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../state/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  email: string;
  password: string;

  private sub: Subscription;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.sub = this.authService.sync().subscribe();
  }

  onSignUp() {
    this.authService.signup(this.email, this.password)
      .catch(
      (errorMessage: string) => {
        console.log(errorMessage);
      });

    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
