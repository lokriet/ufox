import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../state/article.model';
import { ArticleFieldValue } from '../state/article-field-value.model';
import { ArticleFieldName } from 'src/app/articles-setup/state/article-field-name.model';
import { ArticleFieldNameQuery } from 'src/app/articles-setup/state/article-field-name.query';
import { ArticleFieldValueQuery } from '../state/article-field-value.query';
import { Observable } from 'rxjs';
import { ArticleTagQuery } from 'src/app/articles-setup/state/article-tag.query';
import { ArticleTag } from 'src/app/articles-setup/state/article-tag.model';
import { ArticleFieldValueService } from '../state/article-field-value.service';
import { ArticleService } from '../state/article.service';
import { ArticleTypeQuery } from 'src/app/articles-setup/state/article-type.query';


import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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

  articleText: SafeHtml;

  additionalFields: AdditionalField[];
  articleTags: Observable<ArticleTag[]>;

  constructor(private fieldNamesQuery: ArticleFieldNameQuery,
              private fieldValuesQuery: ArticleFieldValueQuery,
              private fieldValueService: ArticleFieldValueService,
              private tagsQuery: ArticleTagQuery,
              private articleTypeQuery: ArticleTypeQuery,
              private articleService: ArticleService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.additionalFields = null;
    this.articleTags = this.tagsQuery.selectAll({filterBy: tag => this.article.tagIds.includes(tag.id)});

    this.articleText = this.sanitizer.bypassSecurityTrustHtml(this.article.text);
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

          // const additionalFieldNames = additionalFieldValues.map(fieldValue => this.fieldNamesQuery.getEntity(fieldValue.fieldNameId));
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
    for (const fieldValueId of this.article.additionalFieldValueIds) {
      this.fieldValueService.remove(fieldValueId);
    }
    this.articleService.remove(this.article.id);
  }

//   getArticleText() {
    
//   }
}
