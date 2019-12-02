import { Component, OnInit } from '@angular/core';

import { ArticleService } from '../articles/state/articles/article.service';
import { AuthService } from '../auth/state/auth.service';
import { ImageService } from '../shared/image/state/image.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthService,
              private articleService: ArticleService,
              private imageService: ImageService) {
  }

  ngOnInit() {
  }


  loggedIn() {
    return !!this.authService.user;
  }

}
