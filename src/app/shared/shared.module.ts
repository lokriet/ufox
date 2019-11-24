import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditTagsComponent } from './edit-tags/edit-tags.component';

@NgModule({
  declarations: [
    EditTagsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    EditTagsComponent
  ]
})
export class SharedModule { }
