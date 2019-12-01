import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';

import { SharedModule } from '../shared/shared.module';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { ArticleViewComponent } from './article-view/article-view.component';
import { ArticlesFilterPanelComponent } from './articles-filter-panel/articles-filter-panel.component';
import { ArticlesListComponent } from './articles-list/articles-list.component';
import { ArticlesOutlinePanelComponent } from './articles-outline-panel/articles-outline-panel.component';
import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticlesComponent } from './articles.component';
import { HighlightPipe } from './article-view/highlight.pipe';


@NgModule({
  declarations: [
    ArticleEditComponent,
    ArticleViewComponent,
    ArticlesComponent,
    ArticlesListComponent,
    ArticlesFilterPanelComponent,
    ArticlesOutlinePanelComponent,
    HighlightPipe
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
    DragDropModule,
    ArticlesRoutingModule
  ],
  exports: [
  ]
})
export class ArticlesModule {

}
