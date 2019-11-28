import { Injectable } from '@angular/core';
import { ActiveState, EntityStore, StoreConfig } from '@datorama/akita';
import { CollectionState } from 'akita-ng-fire';

import { Image } from './image.model';

export interface ImageState extends CollectionState<Image>, ActiveState<string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'image' })
export class ImageStore extends EntityStore<ImageState> {

  constructor() {
    super();
  }

}

