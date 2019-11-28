import { Injectable } from '@angular/core';
import { ImageStore, ImageState } from './image.store';
import { CollectionConfig, CollectionService } from 'akita-ng-fire';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'images' })
export class ImageService extends CollectionService<ImageState> {

  constructor(store: ImageStore) {
    super(store);
  }

}
