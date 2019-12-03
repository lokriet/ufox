import { Injectable } from '@angular/core';
import { ActiveState, EntityStore, StoreConfig } from '@datorama/akita';
import { CollectionState } from 'akita-ng-fire';

import { ArticleSection } from './article-section.model';

export interface ArticleSectionState extends CollectionState<ArticleSection>, ActiveState<string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'article-section' })
export class ArticleSectionStore extends EntityStore<ArticleSectionState> {

  constructor() {
    super();
  }

}

