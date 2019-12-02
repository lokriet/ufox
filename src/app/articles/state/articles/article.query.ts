import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ArticleStore, ArticleState } from './article.store';

@Injectable({ providedIn: 'root' })
export class ArticleQuery extends QueryEntity<ArticleState> {

  constructor(protected store: ArticleStore) {
    super(store);
  }

}
