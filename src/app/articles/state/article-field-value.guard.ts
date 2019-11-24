import { Injectable } from '@angular/core';
import { CollectionGuard, CollectionGuardConfig } from 'akita-ng-fire';
import { ArticleFieldValueState } from './article-field-value.store';
import { ArticleFieldValueService } from './article-field-value.service';

@Injectable({ providedIn: 'root' })
@CollectionGuardConfig({ awaitSync: true })
export class ArticleFieldValueGuard extends CollectionGuard<ArticleFieldValueState> {
  constructor(service: ArticleFieldValueService) {
    super(service);
  }
}
