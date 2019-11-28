import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ImageStore, ImageState } from './image.store';

@Injectable({ providedIn: 'root' })
export class ImageQuery extends QueryEntity<ImageState> {

  constructor(protected store: ImageStore) {
    super(store);
  }

}
