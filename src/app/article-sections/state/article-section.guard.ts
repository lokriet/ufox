import { Injectable } from '@angular/core';
import { CollectionGuard, CollectionGuardConfig } from 'akita-ng-fire';
import { ArticleSectionState } from './article-section.store';
import { ArticleSectionService } from './article-section.service';

@Injectable({ providedIn: 'root' })
@CollectionGuardConfig({ awaitSync: true })
export class ArticleSectionGuard extends CollectionGuard<ArticleSectionState> {
  constructor(service: ArticleSectionService) {
    super(service);
  }
}
