import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { EditTagsComponent } from './edit-tags/edit-tags.component';
import { DropZoneDirective } from './image/drop-zone.directive';
import { FileSizePipe } from './image/file-size.pipe';
import { ImageUploadComponent } from './image/image-upload/image-upload.component';
import { ImageComponent } from './image/image.component';
import { SafeHtmlPipe } from './safe-html.pipe';

@NgModule({
  declarations: [
    EditTagsComponent,
    ConfirmationDialogComponent,
    SafeHtmlPipe,
    FileSizePipe,
    DropZoneDirective,
    ImageComponent,
    ImageUploadComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [
    EditTagsComponent,
    ConfirmationDialogComponent,
    SafeHtmlPipe,
    FileSizePipe,
    DropZoneDirective,
    ImageComponent
  ]
})
export class SharedModule { }
