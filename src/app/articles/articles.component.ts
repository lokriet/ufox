import { Component, OnInit } from '@angular/core';
import { ArticleQuery } from './state/article.query';
import { Observable } from 'rxjs';
import { ArticleFieldNameQuery } from '../articles-setup/state/article-field-name.query';
import { ArticleFieldValueQuery } from './state/article-field-value.query';
import { ArticleTagQuery } from '../articles-setup/state/article-tag.query';
import { ArticleTypeQuery } from '../articles-setup/state/article-type.query';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
  loadingArticles$: Observable<boolean>;
  loadingFieldNames$: Observable<boolean>;
  loadingFieldValues$: Observable<boolean>;
  loadingTags$: Observable<boolean>;
  loadingArticleTypes$: Observable<boolean>;

  constructor(private articleQuery: ArticleQuery,
              private articleFieldNameQuery: ArticleFieldNameQuery,
              private articleFieldValueQuery: ArticleFieldValueQuery,
              private articleTagQuery: ArticleTagQuery,
              private articleTypeQuery: ArticleTypeQuery) {}

  ngOnInit(): void {
    this.loadingArticles$ = this.articleQuery.selectLoading();
    this.loadingFieldNames$ = this.articleFieldNameQuery.selectLoading();
    this.loadingFieldValues$ = this.articleFieldValueQuery.selectLoading();
    this.loadingTags$ = this.articleTagQuery.selectLoading();
    this.loadingArticleTypes$ = this.articleTypeQuery.selectLoading();
  }
}
