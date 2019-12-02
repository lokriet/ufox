import { ArticlesUiState, ArticlesUiStore } from './article-ui.store';
import { Injectable } from '@angular/core';
import { QueryConfig, Query } from '@datorama/akita';

@Injectable({
  providedIn: 'root'
})
@QueryConfig({})
export class ArticlesUiQuery extends Query<ArticlesUiState> {
  constructor(protected store: ArticlesUiStore) {
    super(store);
  }
}
