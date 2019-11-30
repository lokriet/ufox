import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';


export interface ArticlesUiState {
  filters: ArticleFilters;
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

const initialState = {
  filters: {
    tagIds: [],
    tagsFilterType: FilterType.Any,
    articleTypeIds: [],
    fieldValues: [],
    fieldValuesFilterType: FilterType.Any
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
}
