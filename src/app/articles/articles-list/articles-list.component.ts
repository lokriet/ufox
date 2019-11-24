import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Article } from '../state/article.model';
import { ArticleQuery } from '../state/article.query';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.scss']
})
export class ArticlesListComponent implements OnInit {

  articles$: Observable<Article[]>;

  constructor(private articleQuery: ArticleQuery) { }

  ngOnInit() {
    this.articles$ = this.articleQuery.selectAll();
  }

}
