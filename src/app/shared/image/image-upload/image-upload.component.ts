import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { ArticleQuery } from 'src/app/articles/state/articles/article.query';

import { Image } from '../state/image.model';
import { ImageQuery } from '../state/image.query';
import { ImageService } from '../state/image.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit, OnDestroy {
  @ViewChild('popupBoxDiv', { static: false }) popupBoxDiv: ElementRef;
  @Input() enabled: boolean;
  @Output() enabledChange = new EventEmitter<boolean>();
  @Output() img = new EventEmitter<string>();

  images$: Observable<Image[]>;

  isMoving = false;
  dragOffset: any;

  isResizing = false;
  initialResizePoint: any;
  initialSize: any;

  listenersInitialized = false;

  boundMousemoveMove;
  boundMousemoveResize;

  constructor(private imageQuery: ImageQuery,
              private imageService: ImageService,
              private articleQuery: ArticleQuery,
              private storage: AngularFireStorage) { }

  ngOnInit() {
    this.images$ = this.imageQuery.selectAll({sortBy: 'url'});

    const popup = this;
    this.boundMousemoveMove =  this.mousemoveMove.bind(popup);
    this.boundMousemoveResize =  this.mousemoveResize.bind(popup);
  }

  onImageSelected(image: Image) {
    this.img.emit(image.url);
    this.onCloseView();
  }

  onDeleteImage(image) {
    let remove = true;

    const articles = this.articleQuery.getAll({
      filterBy: article => article.imageUrl === image.url || (!!article.text && article.text.includes(this.HtmlEncode(image.url)))
    });

    if (articles.length > 0) {
      if (!confirm('There are articles containing this image. Are you sure?')) {
        remove = false;
      }
    }

    if (remove) {
      this.imageService.remove(image.id);
      this.storage.storage.refFromURL(image.url).delete();
    }
  }

  HtmlEncode(s: string) {
    const el = document.createElement('div');
    el.innerText = el.textContent = s;
    s = el.innerHTML;
    return s;
  }

  ngOnDestroy(): void {
    document.body.removeEventListener('mousemove', this.boundMousemoveMove);
    document.body.removeEventListener('mousemove', this.boundMousemoveResize);
  }

  onCloseView() {
    this.enabled = false;
    this.enabledChange.emit(false);
    document.body.removeEventListener('mousemove', this.boundMousemoveMove);
    document.body.removeEventListener('mousemove', this.boundMousemoveResize);
  }

  mousedownMove($event) {
    this.isMoving = true;
    this.dragOffset = [
        this.popupBoxDiv.nativeElement.offsetLeft - $event.clientX,
        this.popupBoxDiv.nativeElement.offsetTop - $event.clientY
    ];
    document.body.addEventListener('mousemove', this.boundMousemoveMove);
  }

  mouseupMove($event) {
      this.isMoving = false;
      document.body.removeEventListener('mousemove', this.boundMousemoveMove);
  }

  mousemoveMove($event) {
      $event.preventDefault();
      if (this.isMoving) {
        const mousePosition = {
            x : $event.clientX,
            y : $event.clientY
        };

        this.popupBoxDiv.nativeElement.style.left = (mousePosition.x + this.dragOffset[0]) + 'px';
        this.popupBoxDiv.nativeElement.style.top  = (mousePosition.y + this.dragOffset[1]) + 'px';
      }
  }


  mousedownResize($event) {
    this.isResizing = true;
    this.initialResizePoint = { x: $event.clientX, y: $event.clientY };
    this.initialSize = { x: parseFloat(getComputedStyle(this.popupBoxDiv.nativeElement).width),
                         y: parseFloat(getComputedStyle(this.popupBoxDiv.nativeElement).height) };

    document.body.addEventListener('mousemove', this.boundMousemoveResize);
    $event.stopPropagation();
}

  mouseupResize($event) {
      this.isResizing = false;
      document.body.removeEventListener('mousemove', this.boundMousemoveResize);
  }

  mousemoveResize($event) {
      $event.preventDefault();

      if (this.isResizing) {
          const mouseMoveDistance = {
              x : $event.clientX - this.initialResizePoint.x ,
              y : $event.clientY - this.initialResizePoint.y
          };

          const newWindowSize = {
            x: Math.max(200, this.initialSize.x + mouseMoveDistance.x),
            y: Math.max(200, this.initialSize.y + mouseMoveDistance.y)
          };

          this.popupBoxDiv.nativeElement.style.width = (newWindowSize.x) + 'px';
          this.popupBoxDiv.nativeElement.style.height  = (newWindowSize.y) + 'px';
      }
  }
}
