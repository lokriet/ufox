import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ArticleFieldNameStore, ArticleFieldNameState } from './article-field-name.store';

@Injectable({ providedIn: 'root' })
export class ArticleFieldNameQuery extends QueryEntity<ArticleFieldNameState> {

  constructor(protected store: ArticleFieldNameStore) {
    super(store);
  }

}
