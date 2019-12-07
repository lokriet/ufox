import { RouterModule, Route } from '@angular/router';
import { NgModule } from '@angular/core';
import { ArticlesSetupComponent } from './articles-setup.component';
import { ArticleTypeEditComponent } from './article-type-edit/article-type-edit.component';
import { ArticleTypeGuard } from './state/article-type.guard';
import { ArticleTagGuard } from './state/article-tag.guard';
import { ArticleFieldNameGuard } from './state/article-field-name.guard';
import { ArticleTypeSortingComponent } from './article-type-sorting/article-type-sorting.component';
import { AuthGuard } from '../auth/auth.guard';
import { ArticleFieldValueGuard } from '../articles/state/articles/article-field-value.guard';

const routes: Route[] = [
  { 
    path: 'articles-setup',
    component: ArticlesSetupComponent,
    canActivate: [ArticleTypeGuard, ArticleTagGuard, ArticleFieldNameGuard, AuthGuard],
    canDeactivate: [ArticleTypeGuard, ArticleTagGuard, ArticleFieldNameGuard]
  },

  {
    path: 'articles-setup/new',
    component: ArticleTypeEditComponent,
    canActivate: [ArticleTypeGuard, ArticleTagGuard, ArticleFieldNameGuard, AuthGuard],
    canDeactivate: [ArticleTypeGuard, ArticleTagGuard, ArticleFieldNameGuard]
  },

  {
    path: 'articles-setup/edit/:id',
    component: ArticleTypeEditComponent,
    canActivate: [ArticleTypeGuard, ArticleTagGuard, ArticleFieldNameGuard, ArticleFieldValueGuard, AuthGuard],
    canDeactivate: [ArticleTypeGuard, ArticleTagGuard, ArticleFieldNameGuard, ArticleFieldValueGuard]
  },

  {
    path: 'articles-setup/sorting',
    component: ArticleTypeSortingComponent,
    canActivate: [ArticleTypeGuard, AuthGuard],
    canDeactivate: [ArticleTypeGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesSetupRoutingModule { }
