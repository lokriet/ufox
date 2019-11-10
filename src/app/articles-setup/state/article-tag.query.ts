import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ArticleTagStore, ArticleTagState } from './article-tag.store';

@Injectable({ providedIn: 'root' })
export class ArticleTagQuery extends QueryEntity<ArticleTagState> {

  constructor(protected store: ArticleTagStore) {
    super(store);
  }

}
