import { Injectable } from '@angular/core';
import { ArticleFieldValue } from './article-field-value.model';
import { ActiveState, EntityStore, StoreConfig } from '@datorama/akita';
import { CollectionState } from 'akita-ng-fire';

export interface ArticleFieldValueState extends CollectionState<ArticleFieldValue>, ActiveState<string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'article-field-value' })
export class ArticleFieldValueStore extends EntityStore<ArticleFieldValueState> {

  constructor() {
    super();
  }

}

