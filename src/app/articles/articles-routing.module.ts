import { RouterModule, Route } from '@angular/router';
import { NgModule } from '@angular/core';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { ArticlesListComponent } from './articles-list/articles-list.component';

const routes: Route[] = [
  { path: 'articles', component: ArticlesListComponent
    // , children: [
    //   { path: 'new', component: ArticleEditComponent},
    //   { path: 'edit/:id', component: ArticleEditComponent}
    // ]
  },
  { path: 'articles/new', component: ArticleEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule { }
