import { Injectable } from '@angular/core';
import { ArticleStore, ArticleState } from './article.store';
import { CollectionConfig, CollectionService } from 'akita-ng-fire';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'articles' })
export class ArticleService extends CollectionService<ArticleState> {

  constructor(store: ArticleStore) {
    super(store);
  }

}
