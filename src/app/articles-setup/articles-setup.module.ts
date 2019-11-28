import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ArticleTypeEditComponent } from './article-type-edit/article-type-edit.component';
import { ArticleTypeViewComponent } from './article-type-view/article-type-view.component';
import { ArticleTypeListComponent } from './article-type-list/article-type-list.component';
import { ArticlesSetupComponent } from './articles-setup.component';
import { ArticlesSetupRoutingModule } from './articles-setup-routing.module';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    ArticleTypeEditComponent,
    ArticleTypeViewComponent,
    ArticleTypeListComponent,
    ArticlesSetupComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    FontAwesomeModule,
    ArticlesSetupRoutingModule
  ],
  exports: [
  ]
})
export class ArticlesSetupModule { }
