import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { ArticleFieldNameGuard } from '../articles-setup/state/article-field-name.guard';
import { ArticleTagGuard } from '../articles-setup/state/article-tag.guard';
import { ArticleTypeGuard } from '../articles-setup/state/article-type.guard';
import { ImageGuard } from '../shared/image/state/image.guard';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { ArticlesComponent } from './articles.component';
import { ArticleFieldValueGuard } from './state/article-field-value.guard';
import { ArticleGuard } from './state/article.guard';

const routes: Route[] = [
  {
    path: 'articles',
    component: ArticlesComponent,
    canActivate: [ArticleGuard, ArticleTagGuard, ArticleFieldNameGuard, ArticleFieldValueGuard, ArticleTypeGuard],
    canDeactivate: [ArticleGuard, ArticleTagGuard, ArticleFieldNameGuard, ArticleFieldValueGuard, ArticleTypeGuard]
  },
  {
    path: 'articles/new',
    component: ArticleEditComponent,
    canActivate: [ArticleGuard, ArticleTagGuard, ArticleFieldNameGuard, ArticleFieldValueGuard, ArticleTypeGuard, ImageGuard],
    canDeactivate: [ArticleGuard, ArticleTagGuard, ArticleFieldNameGuard, ArticleFieldValueGuard, ArticleTypeGuard, ImageGuard]
  },
  {
    path: 'articles/edit/:id',
    component: ArticleEditComponent,
    canActivate: [ArticleGuard, ArticleTagGuard, ArticleFieldNameGuard, ArticleFieldValueGuard, ArticleTypeGuard, ImageGuard],
    canDeactivate: [ArticleGuard, ArticleTagGuard, ArticleFieldNameGuard, ArticleFieldValueGuard, ArticleTypeGuard, ImageGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule { }
