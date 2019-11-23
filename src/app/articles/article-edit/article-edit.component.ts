import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ArticleType } from 'src/app/articles-setup/state/article-type.model';
import { ArticleTypeService } from 'src/app/articles-setup/state/article-type.service';
import { ArticleTypeQuery } from 'src/app/articles-setup/state/article-type.query';
import { ArticleFieldName } from 'src/app/articles-setup/state/article-field-name.model';
import { ArticleFieldNameService } from 'src/app/articles-setup/state/article-field-name.service';
import { ArticleFieldNameQuery } from 'src/app/articles-setup/state/article-field-name.query';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { guid } from '@datorama/akita';
import { ArticleTag } from 'src/app/articles-setup/state/article-tag.model';
import { ArticleTagQuery } from 'src/app/articles-setup/state/article-tag.query';
import { ArticleTagService } from 'src/app/articles-setup/state/article-tag.service';
import { ArticleTagStore } from 'src/app/articles-setup/state/article-tag.store';
import { ArticleFieldValueService } from '../state/article-field-value.service';
import { ArticleFieldValueQuery } from '../state/article-field-value.query';
import { ArticleService } from '../state/article.service';

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.scss']
})
export class ArticleEditComponent implements OnInit {
  articleTypes$: Observable<ArticleType[]>;
  selectedArticleType: ArticleType;
  additionalFieldNames: ArticleFieldName[];

  addedTags: ArticleTag[];
  allTags$: Observable<ArticleTag[]>;
  showTagsEditView = false;

  articleForm: FormGroup;

  constructor(private articleTypeService: ArticleTypeService,
              private articleTypeQuery: ArticleTypeQuery,
              private articleFieldNameService: ArticleFieldNameService,
              private articleFieldNameQuery: ArticleFieldNameQuery,
              private articleTagService: ArticleTagService,
              private articleTagQuery: ArticleTagQuery,
              private articleFieldValueService: ArticleFieldValueService,
              private articleService: ArticleService) { }

  ngOnInit() {
    this.articleTypeService.syncCollection().subscribe();
    this.articleTypes$ = this.articleTypeQuery.selectAll();
    this.selectedArticleType = null;

    this.articleFieldNameService.syncCollection().subscribe();
    this.articleFieldValueService.syncCollection().subscribe();
    this.articleService.syncCollection().subscribe();
    this.articleTagService.syncCollection().subscribe();
    this.allTags$ = this.articleTagQuery.selectAll();

    this.initForm();
  }

  initForm() {
    this.addedTags = [];

    const id = guid();
    const name = '';
    const articleType = null;
    const articleText = null;
    const additionalFields = new FormArray([]);

    this.articleForm = new FormGroup({
      id: new FormControl(id),
      name: new FormControl(name),
      articleType: new FormControl(articleType),
      articleText: new FormControl(articleText),
      additionalFields
    });
  }

  onArticleTypeSwitched(articleTypeId: string) {
    if (articleTypeId === null) {
      (this.articleForm.get('additionalFields') as FormArray).clear();
      return;
    }

    this.selectedArticleType = this.articleTypeQuery.getEntity(articleTypeId);
    if (this.selectedArticleType != null) {
      this.additionalFieldNames = this.articleFieldNameQuery.getAll({
        filterBy: entity => this.selectedArticleType.articleFields.includes(entity.id),
        sortBy: 'orderNo'
      });

      (this.articleForm.get('additionalFields') as FormArray).clear();
      for (const additionalFieldName of this.additionalFieldNames ) {
        const additionalFieldGroup = new FormGroup({
          id: new FormControl(guid()),
          fieldNameId: new FormControl(additionalFieldName.id),
          value: new FormControl(null)
        });

        (this.articleForm.get('additionalFields') as FormArray).push(additionalFieldGroup);
      }

      this.addedTags = [];
      const defaultTags = this.articleTagQuery.getAll({
        filterBy: entity => this.selectedArticleType.defaultTags.includes(entity.id)
      });

      for (const tag of defaultTags) {
        this.addedTags.push(tag);
      }
    }
  }

  onShowEditTags() {
    this.showTagsEditView = true;
  }

  onTagsViewClosed() {
    this.showTagsEditView = false;
  }

  onAddTag(tagId: string) {
    const tag = this.articleTagQuery.getEntity(tagId);
    if (!this.addedTags.includes(tag)) {
      this.addedTags.push(tag);
    }
  }

  onTagDeleted(deletedTagId: string) {
    if (deletedTagId !== null) {
      this.addedTags = this.addedTags.filter(tag => tag.id !== deletedTagId);
    }
  }

  onSubmit() {
    const additionalFieldValues = [];
    const additionalFieldValueIds = [];
    if (this.articleForm.value.additionalFields != null) {
      for (const additionalField of this.articleForm.value.additionalFields) {
        const additionalFieldValue = {
          id: additionalField.id,
          fieldNameId: additionalField.fieldNameId,
          value: additionalField.value
        };
        additionalFieldValues.push(additionalFieldValue);
        additionalFieldValueIds.push(additionalFieldValue.id);
      }
    }
    this.articleFieldValueService.add(additionalFieldValues);


    const tagIds = this.addedTags.map(tag => tag.id);

    const article = {
      id: guid(),
      type: this.selectedArticleType == null ? null : this.selectedArticleType.id,
      name: this.articleForm.value.name,
      text: this.articleForm.value.articleText,
      additionalFieldValues: additionalFieldValueIds,
      tags: tagIds
    };

    this.articleService.add(article);

    this.initForm();
  }
}
