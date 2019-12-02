import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ArticleFieldValueStore, ArticleFieldValueState } from './article-field-value.store';

@Injectable({ providedIn: 'root' })
export class ArticleFieldValueQuery extends QueryEntity<ArticleFieldValueState> {

  constructor(protected store: ArticleFieldValueStore) {
    super(store);
  }

}
