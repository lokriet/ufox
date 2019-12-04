import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ArticleFieldName } from 'src/app/articles-setup/state/article-field-name.model';
import { ArticleFieldNameQuery } from 'src/app/articles-setup/state/article-field-name.query';
import { ArticleTag } from 'src/app/articles-setup/state/article-tag.model';
import { ArticleTagQuery } from 'src/app/articles-setup/state/article-tag.query';
import { ArticleTypeQuery } from 'src/app/articles-setup/state/article-type.query';

import { ArticleFieldValue } from '../state/articles/article-field-value.model';
import { ArticleFieldValueQuery } from '../state/articles/article-field-value.query';
import { ArticleFieldValueService } from '../state/articles/article-field-value.service';
import { Article } from '../state/articles/article.model';
import { ArticleService } from '../state/articles/article.service';
import { ArticlesUiQuery } from '../state/ui/article-ui.query';
import { ArticlesUiStore } from '../state/ui/article-ui.store';

interface AdditionalField {
  name: ArticleFieldName;
  value: ArticleFieldValue;
}
@Component({
  selector: 'app-article-view',
  templateUrl: './article-view.component.html',
  styleUrls: ['./article-view.component.scss']
})
export class ArticleViewComponent implements OnInit {
  @Input() article: Article;
  @Input() isOdd = true;

  additionalFields: AdditionalField[];
  articleTags: Observable<ArticleTag[]>;

  highlightString: string;

  constructor(private fieldNamesQuery: ArticleFieldNameQuery,
              private fieldValuesQuery: ArticleFieldValueQuery,
              private fieldValueService: ArticleFieldValueService,
              private tagsQuery: ArticleTagQuery,
              private articleTypeQuery: ArticleTypeQuery,
              private articleService: ArticleService,
              private articlesUiStore: ArticlesUiStore,
              private articlesUiQuery: ArticlesUiQuery) {
  }

  ngOnInit() {
    this.additionalFields = null;
    this.articleTags = this.tagsQuery.selectAll({filterBy: tag => this.article.tagIds.includes(tag.id)});

    this.articlesUiQuery.select().subscribe(value => {
      this.highlightString = value.filters.fastSearch;
    });

    this.fieldNamesQuery.selectAll().subscribe(value => {
      this.additionalFields = null;
    });

    this.fieldValuesQuery.selectAll().subscribe(value => {
      this.additionalFields = null;
    });
  }


  public getAdditionalFields(): AdditionalField[] {
    if (this.additionalFields == null) {
      this.additionalFields = [];

      if (this.article != null && this.article.typeId != null) {
        const articleType = this.articleTypeQuery.getEntity(this.article.typeId);
        const additionalFieldNames = this.fieldNamesQuery.getAll({
              filterBy: value => articleType.articleFieldNameIds.includes(value.id), sortBy: 'orderNo'
        });

        if (this.article.additionalFieldValueIds != null && this.article.additionalFieldValueIds.length > 0) {
          const additionalFieldValues = this.fieldValuesQuery.getAll({
            filterBy: fieldValue => this.article.additionalFieldValueIds.includes(fieldValue.id)
          });

          for (const additionalFieldName of additionalFieldNames) {
            const existingValue = additionalFieldValues.find(value => value.fieldNameId === additionalFieldName.id);
            this.additionalFields.push({ name: additionalFieldName, value: existingValue ? existingValue : null});
          }
        }
      }

    }

    return this.additionalFields;
  }

  onDeleteArticle() {
    if (!confirm('Are you sure you wanna delete?')) {
      return;
    }

    for (const fieldValueId of this.article.additionalFieldValueIds) {
      this.fieldValueService.remove(fieldValueId);
    }
    this.articleService.remove(this.article.id);
  }

  onShowArticlesByTag(tagId: string) {
    this.articlesUiStore.updateFilterTags([tagId]);
  }
}
