import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { FilteringPresetStore, FilteringPresetState } from './filtering-preset.store';

@Injectable({ providedIn: 'root' })
export class FilteringPresetQuery extends QueryEntity<FilteringPresetState> {

  constructor(protected store: FilteringPresetStore) {
    super(store);
  }

}
