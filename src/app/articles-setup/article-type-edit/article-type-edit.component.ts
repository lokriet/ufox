import { Component, OnInit } from '@angular/core';
import { guid } from '@datorama/akita';
import { Observable } from 'rxjs';

import { ArticleFieldName } from '../state/article-field-name.model';
import { ArticleFieldNameService } from '../state/article-field-name.service';
import { ArticleTag } from '../state/article-tag.model';
import { ArticleTagQuery } from '../state/article-tag.query';
import { ArticleTypeService } from '../state/article-type.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleFieldNameQuery } from '../state/article-field-name.query';
import { ArticleTypeQuery } from '../state/article-type.query';
import { ArticleType } from '../state/article-type.model';
import { ArticleFieldValueService } from 'src/app/articles/state/article-field-value.service';
import { ArticleFieldValueQuery } from 'src/app/articles/state/article-field-value.query';
import { faChevronUp, faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-article-type-edit',
  templateUrl: './article-type-edit.component.html',
  styleUrls: ['./article-type-edit.component.scss']
})
export class ArticleTypeEditComponent implements OnInit {
  loadingArticleTypes$: Observable<boolean>;
  loadingTags$: Observable<boolean>;
  loadingFieldNames$: Observable<boolean>;

  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;
  faTimes = faTimes;

  editMode = false;
  editedArticleType: ArticleType;

  tags$: Observable<ArticleTag[]>;

  articleTypeName: string;
  newAdditionalFieldName: string;

  additionalFields: ArticleFieldName[];

  editedAdditionalFieldIndex: number;
  editedAdditionalFieldName: string;

  deletedAdditionalFields: ArticleFieldName[];
  addedAdditionalFields: ArticleFieldName[];
  updatedAdditionalFields: ArticleFieldName[];

  defaultTags: ArticleTag[];
  showTagsEditView: boolean;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private tagQuery: ArticleTagQuery,
              private fieldNameService: ArticleFieldNameService,
              private fieldNameQuery: ArticleFieldNameQuery,
              private fieldValueService: ArticleFieldValueService,
              private fieldValueQuery: ArticleFieldValueQuery,
              private articleTypeService: ArticleTypeService,
              private articleTypeQuery: ArticleTypeQuery) {
  }

  ngOnInit() {
    this.tags$ = this.tagQuery.selectAll();
    this.loadingArticleTypes$ = this.articleTypeQuery.selectLoading();
    this.loadingTags$ = this.tagQuery.selectLoading();
    this.loadingFieldNames$ = this.fieldNameQuery.selectLoading();

    this.route.params.subscribe(
      (params: Params) => {
        const editedArticleTypeId = params.id;
        if (editedArticleTypeId != null) {
          this.editedArticleType = this.articleTypeQuery.getEntity(editedArticleTypeId);
        }
        this.editMode = params.id != null;
        this.initForm();
      }
    );
  }

  initForm() {
    if (this.editMode) {
      this.additionalFields =
          this.fieldNameQuery.getAll({
              filterBy: fieldName => this.editedArticleType.articleFieldNameIds.includes(fieldName.id),
              sortBy: 'orderNo'
            }).map(value => ({...value}));
      this.defaultTags =
          this.tagQuery.getAll({filterBy: tag => this.editedArticleType.defaultTagIds.includes(tag.id)});

      this.articleTypeName = this.editedArticleType.name;
    } else {
      this.additionalFields = [];
      this.defaultTags = [];

      this.articleTypeName = null;
    }

    this.newAdditionalFieldName = null;
    this.showTagsEditView = false;

    this.editedAdditionalFieldIndex = -1;
    this.editedAdditionalFieldName = null;

    this.addedAdditionalFields = [];
    this.updatedAdditionalFields = [];
    this.deletedAdditionalFields = [];
  }

  onAdditionalFieldInput(event: KeyboardEvent) {
    if (event.keyCode === 13) { // enter
      event.stopPropagation(); // don't submit the form
      this.onCreateField();
    }
  }

  onCreateField() {
    const additionalField = {id: guid(), orderNo: this.additionalFields.length, name: this.newAdditionalFieldName} as ArticleFieldName;
    this.additionalFields.push(additionalField);
    if (this.editMode) {
      this.addedAdditionalFields.push(additionalField);
    }

    this.newAdditionalFieldName = '';
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

    if (this.editMode) {
      if (!this.addedAdditionalFields.includes(this.additionalFields[index])) {
        if (!this.updatedAdditionalFields.includes(this.additionalFields[index])) {
          this.updatedAdditionalFields.push(this.additionalFields[index]);
        }
      }
      if (!this.addedAdditionalFields.includes(this.additionalFields[index - 1])) {
        if (!this.updatedAdditionalFields.includes(this.additionalFields[index - 1])) {
          this.updatedAdditionalFields.push(this.additionalFields[index - 1]);
        }
      }

      if (this.editedAdditionalFieldIndex !== -1) {
        if (this.editedAdditionalFieldIndex === index) {
          this.editedAdditionalFieldIndex = index - 1;
        } else if (this.editedAdditionalFieldIndex === index - 1) {
          this.editedAdditionalFieldIndex = index;
        }
      }
    }
  }

  onMoveFieldDown(index: number) {
    const lowerField = this.additionalFields[index + 1];
    this.additionalFields[index + 1] = this.additionalFields[index];
    this.additionalFields[index] = lowerField;
    lowerField.orderNo = index;
    this.additionalFields[index + 1].orderNo = index + 1;

    if (this.editMode) {
      if (!this.addedAdditionalFields.includes(this.additionalFields[index])) {
        if (!this.updatedAdditionalFields.includes(this.additionalFields[index])) {
          this.updatedAdditionalFields.push(this.additionalFields[index]);
        }
      }
      if (!this.addedAdditionalFields.includes(this.additionalFields[index + 1])) {
        if (!this.updatedAdditionalFields.includes(this.additionalFields[index + 1])) {
          this.updatedAdditionalFields.push(this.additionalFields[index + 1]);
        }
      }

      if (this.editedAdditionalFieldIndex !== -1) {
        if (this.editedAdditionalFieldIndex === index) {
          this.editedAdditionalFieldIndex = index + 1;
        } else if (this.editedAdditionalFieldIndex === index + 1) {
          this.editedAdditionalFieldIndex = index;
        }
      }
    }
  }

  onDeleteField(index: number) {
    if (this.editMode) {
      if (this.editedAdditionalFieldIndex !== -1 && this.editedAdditionalFieldIndex > index) {
        this.editedAdditionalFieldIndex--;
      }

      if (this.editedArticleType.articleFieldNameIds.includes(this.additionalFields[index].id)) {
        this.deletedAdditionalFields.push(this.additionalFields[index]);
      } else {
        this.addedAdditionalFields.filter(additionalField => additionalField.id !== this.addedAdditionalFields[index].id);
      }

      for (let i = index; i < this.additionalFields.length; i++) {
        if (this.editedArticleType.articleFieldNameIds.includes(this.additionalFields[i].id)) {
          if (!this.updatedAdditionalFields.includes(this.additionalFields[i])) {
            this.updatedAdditionalFields.push(this.additionalFields[i]);
          }
        }
      }
    }

    this.additionalFields.splice(index, 1);

    for (let i = index; i < this.additionalFields.length; i++) {
      this.additionalFields[i].orderNo--;
    }
  }

  onSaveArticleType() {
    if (this.editMode) {
      const updatedArticleType = {
        id: this.editedArticleType.id,
        name: this.articleTypeName,
        defaultTagIds: this.defaultTags.map(tag => tag.id),
        articleFieldNameIds: this.additionalFields.map(articleField => articleField.id)
      };

      if (this.deletedAdditionalFields.length > 0) {
        const deletedAdditionalFieldIds = this.deletedAdditionalFields.map(field => field.id);
        for (const additionalField of this.deletedAdditionalFields) {
          this.fieldValueService.syncCollection().subscribe(() => {
            const affectedFieldValueIds = this.fieldValueQuery.getAll({
              filterBy: value => deletedAdditionalFieldIds.includes(value.fieldNameId)
            }).map(value => value.id);
            if (affectedFieldValueIds.length > 0) {
              if (!confirm('This will delete removed fields from all existing articles. You sure?')) {
                return;
              } else {
                this.fieldValueService.remove(affectedFieldValueIds);
              }
            }

            this.fieldNameService.remove(deletedAdditionalFieldIds);
          });
        }
      }

      this.articleTypeService.update(updatedArticleType);

      if (this.addedAdditionalFields.length > 0) {
        this.fieldNameService.add(this.addedAdditionalFields);
      }
      if (this.updatedAdditionalFields.length > 0) {
        for (const additionalField of this.updatedAdditionalFields) {
          this.fieldNameService.update(additionalField);
        }
      }


    } else {
      if (this.additionalFields.length > 0) {
          this.fieldNameService.add(this.additionalFields);
      }

      const newArticleType = {
        id: guid(),
        name: this.articleTypeName,
        defaultTagIds: this.defaultTags.map(tag => tag.id),
        articleFieldNameIds: this.additionalFields.map(articleField => articleField.id)
      };

      this.articleTypeService.add(newArticleType);
    }

    this.router.navigate(['articles-setup']);
  }

  onRenameField(index: number) {
    if (this.editedAdditionalFieldIndex !== index) {
      this.editedAdditionalFieldIndex = index;
      this.editedAdditionalFieldName = this.additionalFields[index].name;
    }
  }

  onSaveRenamedField(index: number) {
    this.additionalFields[index].name = this.editedAdditionalFieldName;
    if (!this.updatedAdditionalFields.includes(this.additionalFields[index])) {
      this.updatedAdditionalFields.push(this.additionalFields[index]);
    }

    this.editedAdditionalFieldIndex = -1;
    this.editedAdditionalFieldName = null;
  }

  onCancelRenamingField() {
    this.editedAdditionalFieldIndex = -1;
    this.editedAdditionalFieldName = null;
  }
}
