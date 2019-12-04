import { Component, OnInit } from '@angular/core';
import { FilteringPresetQuery } from '../state/ui/filtering-preset.query';
import { Observable } from 'rxjs';
import { FilteringPreset } from '../state/ui/filtering-preset.model';
import { ArticlesUiStore } from '../state/ui/article-ui.store';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FilteringPresetService } from '../state/ui/filtering-preset.service';

@Component({
  selector: 'app-presets-panel',
  templateUrl: './presets-panel.component.html',
  styleUrls: ['./presets-panel.component.scss']
})
export class PresetsPanelComponent implements OnInit {
  faTimes = faTimes;

  allPresets$: Observable<FilteringPreset[]>;

  constructor(private filteringPresetsQuery: FilteringPresetQuery,
              private filteringPresetService: FilteringPresetService,
              private uiStore: ArticlesUiStore) { }

  ngOnInit() {
    this.allPresets$ = this.filteringPresetsQuery.selectAll({sortBy: 'name'});
  }

  loadPreset(preset: FilteringPreset) {
    const fieldValueFilters = [];
    for (let i = 0; i < preset.fieldValues.length; i++) {
      fieldValueFilters.push({
        name: preset.fieldValueNames[i],
        value: preset.fieldValues[i]
      });
    }

    const filters = {
      tagIds: preset.tagIds,
      tagsFilterType: preset.tagsFilterType,
      articleTypeIds: preset.articleTypeIds,
      articleSectionIds: preset.articleSectionIds,
      fieldValues: fieldValueFilters,
      fieldValuesFilterType: preset.fieldValuesFilterType,
      fastSearch: null
    };
    this.uiStore.updateFilters(filters);

    const sortItems = [];
    for (let i = 0; i < preset.sortItemTypes.length; i++) {
      sortItems.push({
        sortItemType: preset.sortItemTypes[i],
        sortItemName: preset.sortItemNames[i],
        sortOrder: preset.sortOrders[i]
      });
    }
    const sorting = { sortItems };
    this.uiStore.updateSorting(sorting);
  }

  deletePreset(preset: FilteringPreset) {
    if (confirm('You wanna delete a preset?')) {
      this.filteringPresetService.remove(preset.id);
    }
  }

}
