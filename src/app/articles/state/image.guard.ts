import { Injectable } from '@angular/core';
import { CollectionGuard, CollectionGuardConfig } from 'akita-ng-fire';
import { ImageService } from './image.service';
import { ImageState } from './image.store';

@Injectable({ providedIn: 'root' })
@CollectionGuardConfig({ awaitSync: true })
export class ImageGuard extends CollectionGuard<ImageState> {
  constructor(service: ImageService) {
    super(service);
  }
}
