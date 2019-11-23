import { Injectable } from '@angular/core';
import { ArticleFieldValueStore, ArticleFieldValueState } from './article-field-value.store';
import { CollectionConfig, CollectionService } from 'akita-ng-fire';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'article-field-values' })
export class ArticleFieldValueService extends CollectionService<ArticleFieldValueState> {

  constructor(store: ArticleFieldValueStore) {
    super(store);
  }

}
