import { Injectable } from '@angular/core';
import { Article } from './article.model';
import { ActiveState, EntityStore, StoreConfig } from '@datorama/akita';
import { CollectionState } from 'akita-ng-fire';

export interface ArticleState extends CollectionState<Article>, ActiveState<string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'article' })
export class ArticleStore extends EntityStore<ArticleState> {
  constructor() {
    super();
  }
}
