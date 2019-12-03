import { Injectable } from '@angular/core';
import { ArticleSectionStore, ArticleSectionState } from './article-section.store';
import { CollectionConfig, CollectionService } from 'akita-ng-fire';
import { ArticleSection } from './article-section.model';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'article-sections' })
export class ArticleSectionService extends CollectionService<ArticleSectionState> {

  constructor(store: ArticleSectionStore) {
    super(store);
  }
}
