import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { guid } from '@datorama/akita';
import { Observable } from 'rxjs';

import { ArticleFieldName } from '../state/article-field-name.model';
import { ArticleFieldNameService } from '../state/article-field-name.service';
import { ArticleTag } from '../state/article-tag.model';
import { ArticleTagQuery } from '../state/article-tag.query';
import { ArticleTypeService } from '../state/article-type.service';
import { Router } from '@angular/router';
import { ArticleFieldNameQuery } from '../state/article-field-name.query';
import { ArticleTypeQuery } from '../state/article-type.query';

@Component({
  selector: 'app-article-type-edit',
  templateUrl: './article-type-edit.component.html',
  styleUrls: ['./article-type-edit.component.scss']
})
export class ArticleTypeEditComponent implements OnInit {
  public loadingArticleTypes$: Observable<boolean>;
  public loadingTags$: Observable<boolean>;
  public loadingFieldNames$: Observable<boolean>;

  tags$: Observable<ArticleTag[]>;
  @ViewChild('createTagInput', { static: false }) createTagInputField: ElementRef;
  @ViewChild('additionalFieldInput', { static: false }) additionalFieldInput: ElementRef;
  @ViewChild('articleTypeNameInput', { static: false }) articleTypeNameInput: ElementRef;
  additionalFields: ArticleFieldName[];
  defaultTags: ArticleTag[];
  showTagsEditView: boolean;

  constructor(private router: Router,
              private tagQuery: ArticleTagQuery,
              private fieldNameService: ArticleFieldNameService,
              private fieldNameQuery: ArticleFieldNameQuery,
              private articleTypeService: ArticleTypeService,
              private articleTypeQuery: ArticleTypeQuery) {
  }

  ngOnInit() {
    this.tags$ = this.tagQuery.selectAll();
    this.loadingArticleTypes$ = this.articleTypeQuery.selectLoading();
    this.loadingTags$ = this.tagQuery.selectLoading();
    this.loadingFieldNames$ = this.fieldNameQuery.selectLoading();

    this.additionalFields = [];
    this.defaultTags = [];
    this.showTagsEditView = false;
  }

  onAdditionalFieldInput(event: KeyboardEvent) {
    if (event.keyCode === 13) { // enter
      event.stopPropagation(); // don't submit the form
      this.onCreateField(this.additionalFieldInput.nativeElement.value);
    }
  }

  onCreateField(fieldName: string) {
    const additionalField = {id: guid(), orderNo: this.additionalFields.length, name: fieldName} as ArticleFieldName;
    this.additionalFields.push(additionalField);
    this.additionalFieldInput.nativeElement.value = '';
  }

  onAddTag(tagId: string) {
    const tag = this.tagQuery.getEntity(tagId);
    if (!this.defaultTags.includes(tag)) {
      this.defaultTags.push(tag);
    }
  }

  onArticleTypeTagDeleted(tagIndex: number) {
    this.defaultTags.splice(tagIndex, 1);
  }

  onShowEditTags() {
    this.showTagsEditView = true;
  }

  onTagsViewClosed() {
    this.showTagsEditView = false;
  }

  onTagDeleted(tagId: string) {
    this.defaultTags = this.defaultTags.filter(tag => tag.id !== tagId);
  }

  onMoveFieldUp(index: number) {
    const upperField = this.additionalFields[index - 1];
    this.additionalFields[index - 1] = this.additionalFields[index];
    this.additionalFields[index] = upperField;
    upperField.orderNo = index;
    this.additionalFields[index - 1].orderNo = index - 1;
  }

  onMoveFieldDown(index: number) {
    const lowerField = this.additionalFields[index + 1];
    this.additionalFields[index + 1] = this.additionalFields[index];
    this.additionalFields[index] = lowerField;
    lowerField.orderNo = index;
    this.additionalFields[index + 1].orderNo = index + 1;
  }

  onDeleteField(index: number) {
    this.additionalFields.splice(index, 1);
  }

  onSaveArticleType() {
    if (this.additionalFields.length > 0) {
        this.fieldNameService.add(this.additionalFields)
    }

    const newArticleType = {
      id: guid(),
      name: this.articleTypeNameInput.nativeElement.value,
      defaultTagIds: this.defaultTags.map(tag => tag.id),
      articleFieldNameIds: this.additionalFields.map(articleField => articleField.id)
    };

    this.articleTypeService.add(newArticleType);

    this.router.navigate(['articles-setup']);
  }
}
