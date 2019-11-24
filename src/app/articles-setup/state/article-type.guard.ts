import { Injectable } from '@angular/core';
import { CollectionGuard, CollectionGuardConfig } from 'akita-ng-fire';
import { ArticleTypeState } from './article-type.store';
import { ArticleTypeService } from './article-type.service';

@Injectable({ providedIn: 'root' })
@CollectionGuardConfig({ awaitSync: true })
export class ArticleTypeGuard extends CollectionGuard<ArticleTypeState> {
  constructor(service: ArticleTypeService) {
    super(service);
  }
}
