import { ArticleTagService } from './article-tag.service';
import { CollectionGuard, CollectionGuardConfig } from 'akita-ng-fire';
import { ArticleTagState } from './article-tag.store';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
@CollectionGuardConfig({ awaitSync: true })
export class ArticleTagGuard extends CollectionGuard<ArticleTagState> {
  constructor(service: ArticleTagService) {
    super(service);
  }
}
