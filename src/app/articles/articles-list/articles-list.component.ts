import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { Article } from '../state/article.model';
import { ArticleQuery } from '../state/article.query';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.scss']
})
export class ArticlesListComponent implements OnInit {
  @Input() articles: Article[];

  constructor() { }

  ngOnInit() {
  }

}
