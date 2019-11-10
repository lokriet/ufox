import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { guid } from '@datorama/akita';
import { Observable } from 'rxjs';

import { ArticleFieldName } from '../state/article-field-name.model';
import { ArticleFieldNameService } from '../state/article-field-name.service';
import { ArticleFieldNameStore } from '../state/article-field-name.store';
import { ArticleTag } from '../state/article-tag.model';
import { ArticleTagQuery } from '../state/article-tag.query';
import { ArticleTagService } from '../state/article-tag.service';
import { ArticleTagStore } from '../state/article-tag.store';
import { ArticleTypeService } from '../state/article-type.service';

@Component({
  selector: 'app-article-type-edit',
  templateUrl: './article-type-edit.component.html',
  styleUrls: ['./article-type-edit.component.scss']
})
export class ArticleTypeEditComponent implements OnInit {
  tags$: Observable<ArticleTag[]>;
  @ViewChild('createTagInput') createTagInputField: ElementRef;

  additionalFields: ArticleFieldName[];
  tags: ArticleTag[];
  showTagsEditView: boolean;

  constructor(private tagStore: ArticleTagStore,
              private tagQuery: ArticleTagQuery,
              private tagService: ArticleTagService,
              private fieldNameStore: ArticleFieldNameStore,
              private fieldNameService: ArticleFieldNameService,
              private articleTypeStore: ArticleTagStore,
              private articleTypeService: ArticleTypeService) { }

  ngOnInit() {
    this.tagService.syncCollection().subscribe();
    this.fieldNameService.syncCollection().subscribe();
    this.articleTypeService.syncCollection().subscribe();

    this.tags$ = this.tagQuery.selectAll();

    this.additionalFields = [];
    this.showTagsEditView = false;
  }

  onCreateField(fieldName: string) {
    const additionalField = {id: guid(), orderNo: this.additionalFields.length, name: fieldName} as ArticleFieldName;
    this.additionalFields.push(additionalField);
  }

  onShowEditTags() {
    this.showTagsEditView = true;
  }

  onTagsViewClosed() {
    this.showTagsEditView = false;
  }
}
