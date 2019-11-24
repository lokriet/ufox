import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../state/article.model';
import { ArticleFieldValue } from '../state/article-field-value.model';
import { ArticleFieldName } from 'src/app/articles-setup/state/article-field-name.model';
import { ArticleFieldNameQuery } from 'src/app/articles-setup/state/article-field-name.query';
import { ArticleFieldValueQuery } from '../state/article-field-value.query';
import { ArticleFieldNameService } from 'src/app/articles-setup/state/article-field-name.service';
import { ArticleFieldValueService } from '../state/article-field-value.service';
import { Observable } from 'rxjs';
import { ArticleTagQuery } from 'src/app/articles-setup/state/article-tag.query';
import { ArticleTagService } from 'src/app/articles-setup/state/article-tag.service';
import { ArticleTag } from 'src/app/articles-setup/state/article-tag.model';

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

  additionalFields: AdditionalField[];
  articleTags: Observable<ArticleTag[]>;

  constructor(private fieldNamesQuery: ArticleFieldNameQuery,
              private fieldValuesQuery: ArticleFieldValueQuery,
              private tagsQuery: ArticleTagQuery) {
  }

  ngOnInit() {
    this.additionalFields = null;
    this.articleTags = this.tagsQuery.selectAll({filterBy: tag => this.article.tagIds.includes(tag.id)});
  }


  public getAdditionalFields(): AdditionalField[] {
    if (this.additionalFields == null) {
      this.additionalFields = [];

      if (this.article != null && this.article.additionalFieldValueIds != null && this.article.additionalFieldValueIds.length > 0) {
        const additionalFieldValues = this.fieldValuesQuery.getAll({
          filterBy: fieldValue => this.article.additionalFieldValueIds.includes(fieldValue.id)
        });

        const additionalFieldNames = additionalFieldValues.map(fieldValue => this.fieldNamesQuery.getEntity(fieldValue.fieldNameId));
        for (let i = 0; i < additionalFieldNames.length; i++) {
          this.additionalFields.push({ name: additionalFieldNames[i], value: additionalFieldValues[i]});
        }
        this.additionalFields.sort((a, b) => a.name.orderNo - b.name.orderNo);
      }
    }

    return this.additionalFields;
  }
}
