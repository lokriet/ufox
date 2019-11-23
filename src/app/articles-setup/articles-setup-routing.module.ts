import { RouterModule, Route } from '@angular/router';
import { NgModule } from '@angular/core';
import { ArticlesSetupComponent } from './articles-setup.component';
import { ArticleTypeEditComponent } from './article-type-edit/article-type-edit.component';

const routes: Route[] = [
  { path: 'articles-setup', component: ArticlesSetupComponent
      // , children: [
      // { path: 'new', component: ArticleTypeEditComponent},
      // { path: 'edit/:id', component: ArticleTypeEditComponent}
    // ]
  },
  { path: 'articles-setup/new', component: ArticleTypeEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesSetupRoutingModule { }
