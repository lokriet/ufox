import { Injectable } from '@angular/core';
import { ArticleType } from './article-type.model';
import { ActiveState, EntityStore, StoreConfig } from '@datorama/akita';
import { CollectionState } from 'akita-ng-fire';

export interface ArticleTypeState extends CollectionState<ArticleType>, ActiveState<string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'article-type' })
export class ArticleTypeStore extends EntityStore<ArticleTypeState> {

  constructor() {
    super();
  }

}

