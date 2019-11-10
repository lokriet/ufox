import { Injectable } from '@angular/core';
import { ArticleTagStore, ArticleTagState } from './article-tag.store';
import { CollectionConfig, CollectionService } from 'akita-ng-fire';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'article-tags' })
export class ArticleTagService extends CollectionService<ArticleTagState> {

  constructor(store: ArticleTagStore) {
    super(store);
  }

}
