import { Injectable } from '@angular/core';
import { ArticleState } from './article.store';
import { CollectionGuard, CollectionGuardConfig } from 'akita-ng-fire';
import { ArticleService } from './article.service';

@Injectable({ providedIn: 'root' })
@CollectionGuardConfig({ awaitSync: true })
export class ArticleGuard extends CollectionGuard<ArticleState> {
  constructor(service: ArticleService) {
    super(service);
  }
}
