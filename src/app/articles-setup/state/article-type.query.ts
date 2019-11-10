import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ArticleTypeStore, ArticleTypeState } from './article-type.store';

@Injectable({ providedIn: 'root' })
export class ArticleTypeQuery extends QueryEntity<ArticleTypeState> {

  constructor(protected store: ArticleTypeStore) {
    super(store);
  }

}
