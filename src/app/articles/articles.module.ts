import { NgModule } from '@angular/core';
import { ArticlesComponent } from './articles.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { ArticleViewComponent } from './article-view/article-view.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ArticlesListComponent } from './articles-list/articles-list.component';
import { SharedModule } from '../shared/shared.module';
import { ArticlesRoutingModule } from './articles-routing.module';


@NgModule({
  declarations: [
    ArticleEditComponent,
    ArticleViewComponent,
    ArticlesComponent,
    ArticlesListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ArticlesRoutingModule
  ],
  exports: [
  ]
})
export class ArticlesModule {

}
