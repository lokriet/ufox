import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ArticleFieldValueService } from 'src/app/articles/state/articles/article-field-value.service';
import { Article } from 'src/app/articles/state/articles/article.model';
import { ArticleQuery } from 'src/app/articles/state/articles/article.query';
import { ArticleService } from 'src/app/articles/state/articles/article.service';

import { ArticleFieldName } from '../state/article-field-name.model';
import { ArticleFieldNameQuery } from '../state/article-field-name.query';
import { ArticleFieldNameService } from '../state/article-field-name.service';
import { ArticleTag } from '../state/article-tag.model';
import { ArticleTagQuery } from '../state/article-tag.query';
import { ArticleType } from '../state/article-type.model';
import { ArticleTypeService } from '../state/article-type.service';

@Component({
  selector: 'app-article-type-view',
  templateUrl: './article-type-view.component.html',
  styleUrls: ['./article-type-view.component.scss']
})
export class ArticleTypeViewComponent implements OnInit {
  loading = false;

  @Input() articleType: ArticleType;

  tags$: Observable<ArticleTag[]>;
  fieldNames$: Observable<ArticleFieldName[]>;

  constructor(private tagsQuery: ArticleTagQuery,
              private fieldNamesQuery: ArticleFieldNameQuery,
              private fieldNamesService: ArticleFieldNameService,
              private articleTypeService: ArticleTypeService,
              private articleQuery: ArticleQuery,
              private articleService: ArticleService,
              private articleFieldValueService: ArticleFieldValueService
  ) { }

  ngOnInit() {
    this.tags$ = this.tagsQuery.selectAll({
      filterBy: entity => this.articleType.defaultTagIds.includes(entity.id),
      sortBy: 'name'
    });

    this.fieldNames$ = this.fieldNamesQuery.selectAll({
      filterBy: entity => this.articleType.articleFieldNameIds.includes(entity.id),
      sortBy: 'orderNo'
    });
  }

  onDeleteArticleType() {
    this.loading = true;
    this.articleTypeService.syncCollection().subscribe();
    this.articleService.syncCollection().subscribe(() => {
      this.loading = false;
      const articles = this.articleQuery.getAll({filterBy: article => article.typeId != null && article.typeId === this.articleType.id});
      if (articles != null && articles.length > 0) {
        if (confirm(`There are ${articles.length} articles with this type. ` +
                    `They will be deleted if you procede. Are you sure about this?`)) {
          this.loading = true;
          this.articleFieldValueService.syncCollection().subscribe(() => {
            this.loading = false;
            this.deleteArticles(articles);
            this.deleteArticleType();
          });
        }
      } else {
        this.deleteArticleType();
      }
    });
  }

  deleteArticles(articles: Article[]) {
    for (const article of articles) {
      for (const fieldValueId of article.additionalFieldValueIds) {
        this.articleFieldValueService.remove(fieldValueId);
      }
      this.articleService.remove(article.id);
    }
  }

  deleteArticleType() {
    for (const fieldNameId of this.articleType.articleFieldNameIds) {
      this.fieldNamesService.remove(fieldNameId);
    }
    this.articleTypeService.remove(this.articleType.id);
  }
}
