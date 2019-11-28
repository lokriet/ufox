import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditTagsComponent } from './edit-tags/edit-tags.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { SafeHtmlPipe } from './safe-html.pipe';

@NgModule({
  declarations: [
    EditTagsComponent,
    ConfirmationDialogComponent,
    SafeHtmlPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    EditTagsComponent,
    ConfirmationDialogComponent,
    SafeHtmlPipe
  ]
})
export class SharedModule { }
