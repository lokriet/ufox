import { Injectable } from '@angular/core';
import { ArticleFieldName } from './article-field-name.model';
import { ActiveState, EntityStore, StoreConfig } from '@datorama/akita';
import { CollectionState } from 'akita-ng-fire';

export interface ArticleFieldNameState extends CollectionState<ArticleFieldName>, ActiveState<string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'article-field-name' })
export class ArticleFieldNameStore extends EntityStore<ArticleFieldNameState> {

  constructor() {
    super();
  }

}

