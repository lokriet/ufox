import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { guid } from '@datorama/akita';
import { Observable } from 'rxjs';
import { ArticleFieldName } from 'src/app/articles-setup/state/article-field-name.model';
import { ArticleFieldNameQuery } from 'src/app/articles-setup/state/article-field-name.query';
import { ArticleFieldNameService } from 'src/app/articles-setup/state/article-field-name.service';
import { ArticleTag } from 'src/app/articles-setup/state/article-tag.model';
import { ArticleTagQuery } from 'src/app/articles-setup/state/article-tag.query';
import { ArticleTagService } from 'src/app/articles-setup/state/article-tag.service';
import { ArticleType } from 'src/app/articles-setup/state/article-type.model';
import { ArticleTypeQuery } from 'src/app/articles-setup/state/article-type.query';
import { ArticleTypeService } from 'src/app/articles-setup/state/article-type.service';

import { ArticleFieldValueService } from '../state/article-field-value.service';
import { ArticleService } from '../state/article.service';
import { Router } from '@angular/router';
import { ArticleQuery } from '../state/article.query';
import { ArticleFieldValueQuery } from '../state/article-field-value.query';

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.scss']
})
export class ArticleEditComponent implements OnInit {
  public loadingArticles$: Observable<boolean>;
  public loadingFieldNames$: Observable<boolean>;
  public loadingFieldValues$: Observable<boolean>;
  public loadingTags$: Observable<boolean>;
  public loadingArticleTypes$: Observable<boolean>;


  articleTypes$: Observable<ArticleType[]>;
  selectedArticleType: ArticleType;
  additionalFieldNames: ArticleFieldName[];

  addedTags: ArticleTag[];
  allTags$: Observable<ArticleTag[]>;
  showTagsEditView = false;

  articleForm: FormGroup;

  constructor(private router: Router,
              private articleTypeQuery: ArticleTypeQuery,
              private articleFieldNameQuery: ArticleFieldNameQuery,
              private articleTagQuery: ArticleTagQuery,
              private articleFieldValueService: ArticleFieldValueService,
              private articleFieldValueQuery: ArticleFieldValueQuery,
              private articleQuery: ArticleQuery,
              private articleService: ArticleService) { }

  ngOnInit() {
    this.loadingArticles$ = this.articleQuery.selectLoading();
    this.loadingFieldNames$ = this.articleFieldNameQuery.selectLoading();
    this.loadingFieldValues$ = this.articleFieldValueQuery.selectLoading();
    this.loadingTags$ = this.articleTagQuery.selectLoading();
    this.loadingArticleTypes$ = this.articleTypeQuery.selectLoading();


    this.articleTypes$ = this.articleTypeQuery.selectAll();
    this.selectedArticleType = null;

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
        filterBy: entity => this.selectedArticleType.articleFieldNameIds.includes(entity.id),
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
        filterBy: entity => this.selectedArticleType.defaultTagIds.includes(entity.id)
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

  onDeleteArticleTag(tagIndex: number) {
    this.addedTags.splice(tagIndex, 1);
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
      typeId: this.selectedArticleType == null ? null : this.selectedArticleType.id,
      name: this.articleForm.value.name,
      text: this.articleForm.value.articleText,
      additionalFieldValueIds,
      tagIds
    };

    this.articleService.add(article);

    // this.initForm();
    this.router.navigate(['articles']);
  }
}
