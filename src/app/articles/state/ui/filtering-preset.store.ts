import { Injectable } from '@angular/core';
import { FilteringPreset } from './filtering-preset.model';
import { ActiveState, EntityStore, StoreConfig } from '@datorama/akita';
import { CollectionState } from 'akita-ng-fire';

export interface FilteringPresetState extends CollectionState<FilteringPreset>, ActiveState<string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'filtering-preset' })
export class FilteringPresetStore extends EntityStore<FilteringPresetState> {

  constructor() {
    super();
  }

}

