import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { guid } from '@datorama/akita';
import { Observable } from 'rxjs';
import { ArticleFieldName } from 'src/app/articles-setup/state/article-field-name.model';
import { ArticleFieldNameQuery } from 'src/app/articles-setup/state/article-field-name.query';
import { ArticleTag } from 'src/app/articles-setup/state/article-tag.model';
import { ArticleTagQuery } from 'src/app/articles-setup/state/article-tag.query';
import { ArticleType } from 'src/app/articles-setup/state/article-type.model';
import { ArticleTypeQuery } from 'src/app/articles-setup/state/article-type.query';
import * as ClassicEditor from 'src/assets/ckeditor/ckeditor';

import { ImageService } from '../../shared/image/state/image.service';
import { ArticleFieldValueQuery } from '../state/article-field-value.query';
import { ArticleFieldValueService } from '../state/article-field-value.service';
import { ArticleQuery } from '../state/article.query';
import { ArticleService } from '../state/article.service';
import { FirebaseImageUploadAdapter } from './image-upload.adapter';
import { MessageService } from 'src/app/messages/state/message.service';

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.scss']
})
export class ArticleEditComponent implements OnInit {
  public static staticFiretorage: AngularFireStorage;
  public static staticImageService: ImageService;


  loadingArticles$: Observable<boolean>;
  loadingFieldNames$: Observable<boolean>;
  loadingFieldValues$: Observable<boolean>;
  loadingTags$: Observable<boolean>;
  loadingArticleTypes$: Observable<boolean>;

  public editor = ClassicEditor;
  ckconfig = {
    placeholder: 'Hello world',
    extraPlugins: [ this.imagePluginFactory]
  };

  editMode = false;
  editedArticleId: string;

  articleTypes$: Observable<ArticleType[]>;
  selectedArticleType: ArticleType;
  additionalFieldNames: ArticleFieldName[];

  deletedFieldValueIds: string[];

  addedTags: ArticleTag[];
  allTags$: Observable<ArticleTag[]>;
  showTagsEditView = false;

  showingPictureInput = false;

  articleForm: FormGroup;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private articleTypeQuery: ArticleTypeQuery,
              private articleFieldNameQuery: ArticleFieldNameQuery,
              private articleTagQuery: ArticleTagQuery,
              private articleFieldValueService: ArticleFieldValueService,
              private articleFieldValueQuery: ArticleFieldValueQuery,
              private articleQuery: ArticleQuery,
              private articleService: ArticleService,
              private messageService: MessageService,
              fireStorage: AngularFireStorage,
              imageService: ImageService) {
    ArticleEditComponent.staticFiretorage = fireStorage;
    ArticleEditComponent.staticImageService = imageService;
  }

  imagePluginFactory(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new FirebaseImageUploadAdapter(loader, ArticleEditComponent.staticFiretorage, ArticleEditComponent.staticImageService);
    };
  }

  ngOnInit() {
    this.loadingArticles$ = this.articleQuery.selectLoading();
    this.loadingFieldNames$ = this.articleFieldNameQuery.selectLoading();
    this.loadingFieldValues$ = this.articleFieldValueQuery.selectLoading();
    this.loadingTags$ = this.articleTagQuery.selectLoading();
    this.loadingArticleTypes$ = this.articleTypeQuery.selectLoading();


    this.articleTypes$ = this.articleTypeQuery.selectAll({sortBy: 'sortingOrder'});
    this.selectedArticleType = null;

    this.allTags$ = this.articleTagQuery.selectAll({sortBy: 'name'});

    this.route.params.subscribe(
      (params: Params) => {
        this.editedArticleId = params.id;
        this.editMode = params.id != null;
        this.initForm();
      }
    );

  }

  initForm() {
    this.addedTags = [];

    let id = guid();
    let name = '';
    let articleTypeId = null;
    let articleText = null;
    let imageUrl = null;
    const additionalArticleFields = new FormArray([]);

    if (this.editMode) {
      this. deletedFieldValueIds = [];

      const editedArticle = this.articleQuery.getEntity(this.editedArticleId);
      this.addedTags = this.articleTagQuery.getAll({
        filterBy: entity => editedArticle.tagIds.includes(entity.id)
      });

      id = this.editedArticleId;
      name = editedArticle.name;
      articleTypeId = editedArticle.typeId;
      articleText = editedArticle.text;

      imageUrl = editedArticle.imageUrl;
      this.showingPictureInput = !!imageUrl;

      if (articleTypeId != null) {
        this.selectedArticleType = this.articleTypeQuery.getEntity(articleTypeId);
        this.additionalFieldNames = this.articleFieldNameQuery.getAll({
          filterBy: entity => this.selectedArticleType.articleFieldNameIds.includes(entity.id),
          sortBy: 'orderNo'
        });

        const additionalFieldValues =
            this.articleFieldValueQuery.getAll({filterBy: value => editedArticle.additionalFieldValueIds.includes(value.id)});

        for (const additionalFieldName of this.additionalFieldNames) {
          const fieldValue = additionalFieldValues.find(value => value.fieldNameId === additionalFieldName.id);
          additionalArticleFields.push(new FormGroup({
            id: new FormControl(fieldValue ? fieldValue.id : null),
            fieldNameId: new FormControl(additionalFieldName.id),
            value: new FormControl(fieldValue ? fieldValue.value : '')
          }));
        }
      }

    }

    this.articleForm = new FormGroup({
      id: new FormControl(id),
      name: new FormControl(name),
      imageUrl: new FormControl(imageUrl),
      articleType: new FormControl(articleTypeId/*{value: articleTypeId, disabled: this.editMode}*/),
      articleText: new FormControl(articleText),
      additionalFields: additionalArticleFields
    });
  }

  onArticleTypeSwitched(articleTypeId: string) {
    if (articleTypeId === null) {
      (this.articleForm.get('additionalFields') as FormArray).clear();
      this.selectedArticleType = null;
      return;
    }

    if (this.editMode) {
      const editedArticle = this.articleQuery.getEntity(this.editedArticleId);
      const fieldsToDelete = editedArticle.additionalFieldValueIds;
      if (fieldsToDelete) {
        for (const fieldValue of fieldsToDelete) {
          if (!this.deletedFieldValueIds.includes(fieldValue)) {
            this.deletedFieldValueIds.push(fieldValue);
          }
        }
      }
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
          id: new FormControl(null),
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

  onDeleteArticleTag(index: number) {
    this.addedTags.splice(index, 1);
  }

  onTagDeleted(deletedTagId: string) {
    if (deletedTagId !== null) {
      this.addedTags = this.addedTags.filter(tag => tag.id !== deletedTagId);
    }
  }

  onSwitchAddingPicture() {
    this.showingPictureInput = !this.showingPictureInput;
  }

  onSubmit(autoSave: boolean) {
    const updatedFieldValues = [];
    const addedFieldValues = [];
    const additionalFieldValueIds = [];
    if (this.articleForm.value.additionalFields != null) {
      for (const additionalField of this.articleForm.value.additionalFields) {
        const additionalFieldValue = {
          id: additionalField.id,
          fieldNameId: additionalField.fieldNameId,
          value: additionalField.value
        };

        if (this.editMode) {
          if (additionalFieldValue.id != null) {
            updatedFieldValues.push(additionalFieldValue);
          } else {
            additionalFieldValue.id = guid();
            addedFieldValues.push(additionalFieldValue);
          }
        } else {
          additionalFieldValue.id = guid();
          addedFieldValues.push(additionalFieldValue);
        }
        additionalFieldValueIds.push(additionalFieldValue.id);
      }
    }

    const tagIds = this.addedTags.map(tag => tag.id);

    const article = {
      id: this.articleForm.value.id,
      typeId: this.selectedArticleType.id,
      name: this.articleForm.value.name,
      text: this.articleForm.value.articleText,
      imageUrl: this.showingPictureInput ? this.articleForm.value.imageUrl : null,
      additionalFieldValueIds,
      tagIds
    };

    if (this.editMode) {
      this.articleService.update(article);
      for (const fieldValue of updatedFieldValues) {
        this.articleFieldValueService.update(fieldValue);
      }
      this.articleFieldValueService.add(addedFieldValues);

      this.articleFieldValueService.remove(this.deletedFieldValueIds);
    } else {
      this.articleService.add(article);
      this.articleFieldValueService.add(addedFieldValues);
    }

    if (!autoSave) {
      this.messageService.addInfo(`Saved ${article.name ? article.name : 'noname'} article`);
      this.router.navigate(['articles']);
    } else {
      this.messageService.addInfo(`Autosaved ${article.name ? article.name : 'noname'} article`);
      if (!this.editMode) {
        this.editMode = true;
        this.editedArticleId = this.articleForm.value.id;
        this.initForm();
      }
    }
  }

}
