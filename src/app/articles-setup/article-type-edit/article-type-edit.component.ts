import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { guid } from '@datorama/akita';
import { Observable } from 'rxjs';

import { ArticleFieldName } from '../state/article-field-name.model';
import { ArticleFieldNameService } from '../state/article-field-name.service';
import { ArticleTag } from '../state/article-tag.model';
import { ArticleTagQuery } from '../state/article-tag.query';
import { ArticleTagService } from '../state/article-tag.service';
import { ArticleTypeService } from '../state/article-type.service';

@Component({
  selector: 'app-article-type-edit',
  templateUrl: './article-type-edit.component.html',
  styleUrls: ['./article-type-edit.component.scss']
})
export class ArticleTypeEditComponent implements OnInit {
  tags$: Observable<ArticleTag[]>;
  @ViewChild('createTagInput', { static: false }) createTagInputField: ElementRef;
  @ViewChild('additionalFieldInput', { static: true }) additionalFieldInput: ElementRef;
  @ViewChild('articleTypeNameInput', { static: true }) articleTypeNameInput: ElementRef;
  additionalFields: ArticleFieldName[];
  defaultTags: ArticleTag[];
  showTagsEditView: boolean;

  constructor(private tagQuery: ArticleTagQuery,
              private tagService: ArticleTagService,
              private fieldNameService: ArticleFieldNameService,
              private articleTypeService: ArticleTypeService) { }

  ngOnInit() {
    this.tagService.syncCollection().subscribe();
    this.fieldNameService.syncCollection().subscribe();
    this.articleTypeService.syncCollection().subscribe();

    this.tags$ = this.tagQuery.selectAll();

    this.additionalFields = [];
    this.defaultTags = [];
    this.showTagsEditView = false;
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

  onSaveArticleType() {
    if (this.additionalFields.length > 0) {
        this.fieldNameService.add(this.additionalFields)
    }

    const newArticleType = {
      id: guid(),
      name: this.articleTypeNameInput.nativeElement.value,
      defaultTags: this.defaultTags.map(tag => tag.id),
      articleFields: this.additionalFields.map(articleField => articleField.id)
    };

    this.articleTypeService.add(newArticleType);
  }
}
