import { Component, OnInit, forwardRef } from '@angular/core';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { ImageService } from './state/image.service';
import { guid } from '@datorama/akita';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';


export const IMAGE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ImageComponent),
  multi: true,
};

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  providers: [IMAGE_VALUE_ACCESSOR],
})
export class ImageComponent implements ControlValueAccessor {

  faUpload = faUpload;
  imageUrl: string;
  percentage$: Observable<number>;
  snapshot$: Observable<any>;

  task: AngularFireUploadTask;

  isHovering: boolean;

  showChooseFromServerImagesPopup = false;

  onChange: any = () => { };

  constructor(private storage: AngularFireStorage,
              private imageService: ImageService) { }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  startUpload(event: FileList) {
    const file = event.item(0);

    if (file === null) {
      return;
    }

    const path = `images/${new Date().getTime()}_${file.name}`;

    this.task = this.storage.upload(path, file);
    const ref = this.storage.ref(path);

    this.percentage$ = this.task.percentageChanges();
    this.snapshot$   = this.task.snapshotChanges();

    this.task.snapshotChanges().pipe(
      finalize(() => {
        ref.getDownloadURL().subscribe(url => {
          this.imageService.add({id: guid(), url});
          this.imageUrl = url;
          this.onChange(this.imageUrl);
        });
      })
    )
    .subscribe();
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

  onGetImageFromServer() {
    this.showChooseFromServerImagesPopup = true;
  }

  onImageSelectedFromServer(imgUrl) {
    this.imageUrl = imgUrl;
    this.task = null;
    this.snapshot$ = null;
    this.percentage$ = null;
    this.onChange(this.imageUrl);
  }

  onClear() {
    this.imageUrl = null;
    this.task = null;
    this.snapshot$ = null;
    this.percentage$ = null;
    this.onChange(null);
  }

  writeValue(imgUrl: string): void {
    this.imageUrl = imgUrl;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    // do nothing
  }

}
