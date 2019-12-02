import { FilterType, SortItemType, SortOrder } from './article-ui.store';

export interface FilteringPreset {
  id: string;
  name: string;
  // filters
  tagIds: string[];
  tagsFilterType: FilterType;
  articleTypeIds: string[];
  fieldValueNames: string[];
  fieldValues: string[];
  fieldValuesFilterType: FilterType;

  //sorting
  sortItemTypes: SortItemType[];
  sortItemNames: string[];
  sortOrders: SortOrder[];
}

export function createFilteringPreset(params: Partial<FilteringPreset>) {
  return {

  } as FilteringPreset;
}
