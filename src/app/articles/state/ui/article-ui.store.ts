import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';


export interface ArticlesUiState {
  filters: ArticleFilters;
  sorting: ArticleSorting;
  filterPanelState: FilterPanelState;
}


export enum SideView {
  Filters = 'Filters',
  Outline = 'Outline',
  Presets = 'Presets'
}

export interface FilterPanelState {
  sidePanelExpanded: boolean;
  tagsFiltersExpanded: boolean;
  typeFiltersExpanded: boolean;
  sectionFiltersExpanded: boolean;
  fieldFiltersExpanded: boolean;
  sortingOrderExpanded: boolean;
  sortingFieldsExpanded: boolean;
  selectedSideView: SideView;
}

export enum FilterType {
  Any = 0,
  All = 1
}

export interface FieldValueFilter {
  name: string;
  value: string;
}

export interface ArticleFilters {
  tagIds: string[];
  tagsFilterType: FilterType;
  articleTypeIds: string[];
  articleSectionIds: string[];
  fieldValues: FieldValueFilter[];
  fieldValuesFilterType: FilterType;
  fastSearch: string;
}

export interface ArticleSorting {
  sortItems: SortItem[];
}

export interface SortItem {
  sortItemType: SortItemType;
  sortItemName: string;
  sortOrder: SortOrder;
}

export enum SortItemType {
  ArticleName = 0,
  ArticleField = 1,
  ArticleSection = 2
}

export enum SortOrder {
  Asc = 0,
  Desc = 1
}

const initialState = {
  filters: {
    tagIds: [],
    tagsFilterType: FilterType.Any,
    articleTypeIds: [],
    articleSectionIds: [],
    fieldValues: [],
    fieldValuesFilterType: FilterType.Any,
    fastSearch: null
  },
  sorting: { sortItems: [
    {
      sortItemType: SortItemType.ArticleSection,
      sortItemName: null,
      sortOrder: SortOrder.Asc
    },

    {
      sortItemType: SortItemType.ArticleName,
      sortItemName: null,
      sortOrder: SortOrder.Asc
    }
  ]},
  filterPanelState: {
    sidePanelExpanded: true,
    tagsFiltersExpanded: true,
    typeFiltersExpanded: true,
    sectionFiltersExpanded: true,
    fieldFiltersExpanded: true,
    sortingOrderExpanded: true,
    sortingFieldsExpanded: true,
    selectedSideView: SideView.Filters
  }
}

@Injectable({ providedIn: 'root' })
@StoreConfig({name: 'articlesUi'})
export class ArticlesUiStore extends Store<ArticlesUiState> {

  constructor() {
    super(initialState);
  }

  reset() {
    this.update(initialState);
  }

  resetFilters() {
    this.update({...this._value, filters: {...initialState.filters}});
  }

  resetSorting() {
    this.update({...this._value, sorting: {...initialState.sorting}});
  }

  updateFilters(filters: ArticleFilters) {
    this.update({...this._value, filters: {...filters}});
  }

  updateSorting(sorting: ArticleSorting) {
    this.update({...this._value, sorting: {...sorting}});
  }

  updateFilterTags(tagIds: string[]) {
    this.update({ ...this._value(), filters: {...this._value().filters, tagIds} });
  }

  updateTagsFilterType(tagsFilterType: FilterType) {
    this.update({ ...this._value(), filters: {...this._value().filters, tagsFilterType} });
  }

  updateFilterArticleTypes(articleTypeIds: string[]) {
    this.update({ ...this._value(), filters: {...this._value().filters, articleTypeIds} });
  }

  updateFilterArticleSections(articleSectionIds: string[]) {
    this.update({ ...this._value(), filters: {...this._value().filters, articleSectionIds} });
  }

  updateFilterFieldValues(fieldValues: FieldValueFilter[]) {
    this.update({ ...this._value(), filters: {...this._value().filters, fieldValues} });
  }

  updateFieldValuesFilterType(fieldValuesFilterType: FilterType) {
    this.update({ ...this._value(), filters: {...this._value().filters, fieldValuesFilterType} });
  }

  updateFastSearch(fastSearch: string) {
    this.update({ ...this._value(), filters: {...this._value().filters, fastSearch} });
  }

  updateSortingOrder(sortItems: SortItem[]) {
    this.update({...this._value, sorting: { sortItems }});
  }

  updateFilterPanelState(filterPanelState: FilterPanelState) {
    this.update({...this._value, filterPanelState });
  }
}
