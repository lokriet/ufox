import { NgModule } from '@angular/core';
import { ArticlesComponent } from './articles.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { ArticleViewComponent } from './article-view/article-view.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ArticlesListComponent } from './articles-list/articles-list.component';
import { SharedModule } from '../shared/shared.module';
import { ArticlesRoutingModule } from './articles-routing.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { ArticlesFilterPanelComponent } from './articles-filter-panel/articles-filter-panel.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    ArticleEditComponent,
    ArticleViewComponent,
    ArticlesComponent,
    ArticlesListComponent,
    ArticlesFilterPanelComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    CKEditorModule,
    NgSelectModule,
    FontAwesomeModule,
    ArticlesRoutingModule
  ],
  exports: [
  ]
})
export class ArticlesModule {

}
