import { Injectable } from '@angular/core';
import { ArticleTypeStore, ArticleTypeState } from './article-type.store';
import { CollectionConfig, CollectionService, WriteOptions } from 'akita-ng-fire';
import { ArticleType } from './article-type.model';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'article-types' })
export class ArticleTypeService extends CollectionService<ArticleTypeState> {

  constructor(store: ArticleTypeStore) {
    super(store);
  }

  updateSortingOrder(articleType: ArticleType, newSortingOrder: number) {
    this.update({...articleType, sortingOrder: newSortingOrder});
  }
}
