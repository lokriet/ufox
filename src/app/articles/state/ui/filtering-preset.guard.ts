import { Injectable } from '@angular/core';
import { CollectionGuard, CollectionGuardConfig } from 'akita-ng-fire';
import { FilteringPresetState } from './filtering-preset.store';
import { FilteringPresetService } from './filtering-preset.service';

@Injectable({ providedIn: 'root' })
@CollectionGuardConfig({ awaitSync: true })
export class FilteringPresetGuard extends CollectionGuard<FilteringPresetState> {
  constructor(service: FilteringPresetService) {
    super(service);
  }
}
