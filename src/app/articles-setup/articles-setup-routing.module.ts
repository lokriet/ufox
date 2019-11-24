import { RouterModule, Route } from '@angular/router';
import { NgModule } from '@angular/core';
import { ArticlesSetupComponent } from './articles-setup.component';
import { ArticleTypeEditComponent } from './article-type-edit/article-type-edit.component';
import { ArticleTypeGuard } from './state/article-type.guard';
import { ArticleTagGuard } from './state/article-tag.guard';
import { ArticleFieldNameGuard } from './state/article-field-name.guard';

const routes: Route[] = [
  { 
    path: 'articles-setup',
    component: ArticlesSetupComponent,
    canActivate: [ArticleTypeGuard, ArticleTagGuard, ArticleFieldNameGuard],
    canDeactivate: [ArticleTypeGuard, ArticleTagGuard, ArticleFieldNameGuard]
  },

  {
    path: 'articles-setup/new',
    component: ArticleTypeEditComponent,
    canActivate: [ArticleTypeGuard, ArticleTagGuard, ArticleFieldNameGuard],
    canDeactivate: [ArticleTypeGuard, ArticleTagGuard, ArticleFieldNameGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesSetupRoutingModule { }
