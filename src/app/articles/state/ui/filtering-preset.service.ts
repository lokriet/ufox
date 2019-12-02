import { Injectable } from '@angular/core';
import { FilteringPresetStore, FilteringPresetState } from './filtering-preset.store';
import { CollectionConfig, CollectionService } from 'akita-ng-fire';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'filtering-presets' })
export class FilteringPresetService extends CollectionService<FilteringPresetState> {

  constructor(store: FilteringPresetStore) {
    super(store);
  }

}
