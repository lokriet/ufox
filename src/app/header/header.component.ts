import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/state/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private sub: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.sub = this.authService.sync().subscribe();
  }

  onLogout() {
    this.authService.signOut();
  }

  isAuthenticated() {
    return !!this.authService.user;
  }

  userEmail() {
    return this.authService.user.email;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
