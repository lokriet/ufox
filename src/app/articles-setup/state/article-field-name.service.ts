import { Injectable } from '@angular/core';
import { ArticleFieldNameStore, ArticleFieldNameState } from './article-field-name.store';
import { CollectionConfig, CollectionService } from 'akita-ng-fire';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'article-field-names' })
export class ArticleFieldNameService extends CollectionService<ArticleFieldNameState> {

  constructor(store: ArticleFieldNameStore) {
    super(store);
  }

}
