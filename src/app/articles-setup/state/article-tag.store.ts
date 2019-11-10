import { Injectable } from '@angular/core';
import { ArticleTag } from './article-tag.model';
import { ActiveState, EntityStore, StoreConfig } from '@datorama/akita';
import { CollectionState } from 'akita-ng-fire';

export interface ArticleTagState extends CollectionState<ArticleTag>, ActiveState<string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'article-tag' })
export class ArticleTagStore extends EntityStore<ArticleTagState> {

  constructor() {
    super();
  }

}

