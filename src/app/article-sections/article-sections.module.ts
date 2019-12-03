import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleSectionsComponent } from './article-sections.component';
import { ArticleSectionsRoutingModule } from './article-sections-routing.module';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DragDropModule } from '@angular/cdk/drag-drop';



@NgModule({
  declarations: [ArticleSectionsComponent],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    DragDropModule,
    ArticleSectionsRoutingModule
  ]
})
export class ArticleSectionsModule { }
