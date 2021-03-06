import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { ArticleFieldNameGuard } from '../articles-setup/state/article-field-name.guard';
import { ArticleTagGuard } from '../articles-setup/state/article-tag.guard';
import { ArticleTypeGuard } from '../articles-setup/state/article-type.guard';
import { ImageGuard } from '../shared/image/state/image.guard';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { ArticlesComponent } from './articles.component';
import { ArticleFieldValueGuard } from './state/articles/article-field-value.guard';
import { ArticleGuard } from './state/articles/article.guard';
import { FilteringPresetGuard } from './state/ui/filtering-preset.guard';
import { AuthGuard } from '../auth/auth.guard';
import { ArticleSectionGuard } from '../article-sections/state/article-section.guard';

const routes: Route[] = [
  {
    path: 'articles',
    component: ArticlesComponent,
    canActivate: [
      ArticleGuard,
      ArticleTagGuard,
      ArticleFieldNameGuard,
      ArticleFieldValueGuard,
      ArticleTypeGuard,
      FilteringPresetGuard,
      ArticleSectionGuard,
      AuthGuard],
    canDeactivate: [
      ArticleGuard,
      ArticleTagGuard,
      ArticleFieldNameGuard,
      ArticleFieldValueGuard,
      ArticleTypeGuard,
      FilteringPresetGuard,
      ArticleSectionGuard]
  },
  {
    path: 'articles/new',
    component: ArticleEditComponent,
    canActivate: [
      ArticleGuard,
      ArticleTagGuard,
      ArticleFieldNameGuard,
      ArticleFieldValueGuard,
      ArticleTypeGuard,
      ArticleSectionGuard,
      ImageGuard,
      AuthGuard],
    canDeactivate: [
      ArticleGuard,
      ArticleTagGuard,
      ArticleFieldNameGuard,
      ArticleFieldValueGuard,
      ArticleTypeGuard,
      ArticleSectionGuard,
      ImageGuard]
  },
  {
    path: 'articles/edit/:id',
    component: ArticleEditComponent,
    canActivate: [
      ArticleGuard,
      ArticleTagGuard,
      ArticleFieldNameGuard,
      ArticleFieldValueGuard,
      ArticleTypeGuard,
      ArticleSectionGuard,
      ImageGuard,
      AuthGuard],
    canDeactivate: [
      ArticleGuard,
      ArticleTagGuard,
      ArticleFieldNameGuard,
      ArticleFieldValueGuard,
      ArticleTypeGuard,
      ArticleSectionGuard,
      ImageGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule { }
