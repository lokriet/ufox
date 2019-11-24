import { ArticleFieldNameService } from './article-field-name.service';
import { CollectionGuard, CollectionGuardConfig } from 'akita-ng-fire';
import { ArticleFieldNameState } from './article-field-name.store';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
@CollectionGuardConfig({ awaitSync: true })
export class ArticleFieldNameGuard extends CollectionGuard<ArticleFieldNameState> {
  constructor(service: ArticleFieldNameService) {
    super(service);
  }
}
