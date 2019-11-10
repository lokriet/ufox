import { Injectable } from '@angular/core';
import { ArticleTypeStore, ArticleTypeState } from './article-type.store';
import { CollectionConfig, CollectionService } from 'akita-ng-fire';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'article-types' })
export class ArticleTypeService extends CollectionService<ArticleTypeState> {

  constructor(store: ArticleTypeStore) {
    super(store);
  }

}
