import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';


export interface ArticlesUiState {
  filters: ArticleFilters;
  sorting: ArticleSorting;
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
  fieldValues: FieldValueFilter[];
  fieldValuesFilterType: FilterType;
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
  ArticleType = 2
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
    fieldValues: [],
    fieldValuesFilterType: FilterType.Any
  },
  sorting: { sortItems: [
    {
      sortItemType: SortItemType.ArticleType,
      sortItemName: null,
      sortOrder: SortOrder.Asc
    },

    {
      sortItemType: SortItemType.ArticleName,
      sortItemName: null,
      sortOrder: SortOrder.Asc
    }
  ]}
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

  updateFilterTags(tagIds: string[]) {
    this.update({ ...this._value(), filters: {...this._value().filters, tagIds} });
  }

  updateTagsFilterType(tagsFilterType: FilterType) {
    this.update({ ...this._value(), filters: {...this._value().filters, tagsFilterType} });
  }

  updateFilterArticleTypes(articleTypeIds: string[]) {
    this.update({ ...this._value(), filters: {...this._value().filters, articleTypeIds} });
  }

  updateFilterFieldValues(fieldValues: FieldValueFilter[]) {
    this.update({ ...this._value(), filters: {...this._value().filters, fieldValues} });
  }

  updateFieldValuesFilterType(fieldValuesFilterType: FilterType) {
    this.update({ ...this._value(), filters: {...this._value().filters, fieldValuesFilterType} });
  }

  updateSortingOrder(sortItems: SortItem[]) {
    this.update({...this._value, sorting: { sortItems }});
  }
}
