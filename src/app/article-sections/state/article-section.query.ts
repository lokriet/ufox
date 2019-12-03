import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ArticleSectionStore, ArticleSectionState } from './article-section.store';

@Injectable({ providedIn: 'root' })
export class ArticleSectionQuery extends QueryEntity<ArticleSectionState> {

  constructor(protected store: ArticleSectionStore) {
    super(store);
  }

}
