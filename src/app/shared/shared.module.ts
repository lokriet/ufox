import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditTagsComponent } from './edit-tags/edit-tags.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [
    EditTagsComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    EditTagsComponent,
    ConfirmationDialogComponent
  ]
})
export class SharedModule { }
