import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../state/article.service';
import { ArticleQuery } from '../state/article.query';
import { Observable } from 'rxjs';
import { Article } from '../state/article.model';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.scss']
})
export class ArticlesListComponent implements OnInit {

  articles$: Observable<Article[]>;

  constructor(private articleService: ArticleService,
              private articleQuery: ArticleQuery) { }

  ngOnInit() {
    this.articleService.syncCollection().subscribe();
    this.articles$ = this.articleQuery.selectAll();
  }

}
