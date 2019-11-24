import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ArticleTagQuery } from './state/article-tag.query';
import { ArticleFieldNameQuery } from './state/article-field-name.query';
import { ArticleTypeQuery } from './state/article-type.query';

@Component({
  selector: 'app-articles-setup',
  templateUrl: './articles-setup.component.html',
  styleUrls: ['./articles-setup.component.scss']
})
export class ArticlesSetupComponent implements OnInit {
  public loadingArticleTypes$: Observable<boolean>;
  public loadingTags$: Observable<boolean>;
  public loadingFieldNames$: Observable<boolean>;

  constructor(private articleTypeQuery: ArticleTypeQuery,
              private articleTagQuery: ArticleTagQuery,
              private articleFieldNameQuery: ArticleFieldNameQuery) { }

  ngOnInit() {
    this.loadingArticleTypes$ = this.articleTypeQuery.selectLoading();
    this.loadingTags$ = this.articleTagQuery.selectLoading();
    this.loadingFieldNames$ = this.articleFieldNameQuery.selectLoading();
  }

}
