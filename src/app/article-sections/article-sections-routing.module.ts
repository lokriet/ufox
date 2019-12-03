import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { ArticleSectionGuard } from './state/article-section.guard';
import { ArticleSectionsComponent } from './article-sections.component';
import { ArticleGuard } from '../articles/state/articles/article.guard';

const routes: Route[] = [
  {
    path: 'article-sections',
    component: ArticleSectionsComponent,
    canActivate: [ArticleSectionGuard, ArticleGuard, AuthGuard],
    canDeactivate: [ArticleSectionGuard, ArticleGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleSectionsRoutingModule { }
