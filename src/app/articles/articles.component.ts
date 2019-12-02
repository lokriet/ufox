import { Component, OnInit } from '@angular/core';
import { faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';

import { ArticleFieldNameQuery } from '../articles-setup/state/article-field-name.query';
import { ArticleTagQuery } from '../articles-setup/state/article-tag.query';
import { ArticleTypeQuery } from '../articles-setup/state/article-type.query';
import { ArticleFieldValueQuery } from './state/articles/article-field-value.query';
import { Article } from './state/articles/article.model';
import { ArticleQuery } from './state/articles/article.query';
import { ArticlesUiQuery } from './state/ui/article-ui.query';
import {
  ArticlesUiState,
  ArticlesUiStore,
  FilterPanelState,
  FilterType,
  SideView,
  SortItemType,
  SortOrder,
} from './state/ui/article-ui.store';
import { FilteringPresetQuery } from './state/ui/filtering-preset.query';


@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
  faCollapse = faAngleDoubleLeft;

  loadingArticles$: Observable<boolean>;
  loadingFieldNames$: Observable<boolean>;
  loadingFieldValues$: Observable<boolean>;
  loadingTags$: Observable<boolean>;
  loadingArticleTypes$: Observable<boolean>;
  loadingFilteringPresets$: Observable<boolean>;

  allArticles: Article[];
  filteredArticles: Article[];
  filtersAndSorting: ArticlesUiState;
  userFiltersNotEmpty = false;
  sidePanelState: FilterPanelState;

  fastSearchString: string = null;

  // fastSearchString = null;

  constructor(private articleQuery: ArticleQuery,
              private articleUiQuery: ArticlesUiQuery,
              private articlesUiStore: ArticlesUiStore,
              private articleFieldNameQuery: ArticleFieldNameQuery,
              private articleFieldValueQuery: ArticleFieldValueQuery,
              private articleTagQuery: ArticleTagQuery,
              private articleTypeQuery: ArticleTypeQuery,
              private filteringPresetsQuery: FilteringPresetQuery) {}

  ngOnInit(): void {
    this.loadingArticles$ = this.articleQuery.selectLoading();
    this.loadingFieldNames$ = this.articleFieldNameQuery.selectLoading();
    this.loadingFieldValues$ = this.articleFieldValueQuery.selectLoading();
    this.loadingTags$ = this.articleTagQuery.selectLoading();
    this.loadingArticleTypes$ = this.articleTypeQuery.selectLoading();
    this.loadingFilteringPresets$ = this.filteringPresetsQuery.selectLoading();

    this.articleQuery.selectAll().subscribe(articles => {
      this.allArticles = articles;
      this.filteredArticles = this.applyFiltersAndSorting();
    });

    this.articleUiQuery.select().subscribe(value => {
      this.filtersAndSorting = value;
      this.filteredArticles = this.applyFiltersAndSorting();
      this.userFiltersNotEmpty = !this.filtersEmpty(value);

      this.fastSearchString = value.filters.fastSearch;

      this.sidePanelState = {...value.filterPanelState};
    });
  }

  filtersEmpty(uiState: ArticlesUiState): boolean {
    if (uiState.filters.tagIds && uiState.filters.tagIds.length > 0) {
       return false;
    }

    if (uiState.filters.articleTypeIds && uiState.filters.articleTypeIds.length > 0) {
      return false;
    }

    if (uiState.filters.fieldValues && uiState.filters.fieldValues.length > 0) {
      return false;
    }

    return true;
  }

  applyFiltersAndSorting(): Article[] {
    let result = this.allArticles;
    if (this.filtersAndSorting != null && this.allArticles !== null) {
      result = this.filterByTags(this.allArticles);
      result = this.filterByArticleTypes(result);
      result = this.filterFieldValues(result);
      result = this.filterFastSearch(result);
      result = this.sort(result);
    }
    return result;
  }

  filterByTags(articles: Article[]): Article[] {
    const tagIds = this.filtersAndSorting.filters.tagIds;
    const tagFilterType = this.filtersAndSorting.filters.tagsFilterType;

    if (!tagIds || tagIds.length === 0) {
      return articles;
    }

    switch (tagFilterType) {
      case FilterType.Any:
        return articles.filter(article => article.tagIds.some(tagId => tagIds.includes(tagId)));
      case FilterType.All:
        return articles.filter(article => tagIds.every(tagId => article.tagIds.includes(tagId)));
    }
  }

  filterByArticleTypes(articles: Article[]): Article[] {
    const articleTypeIds = this.filtersAndSorting.filters.articleTypeIds;

    if (!articleTypeIds || articleTypeIds.length === 0) {
      return articles;
    }

    return articles.filter(article => articleTypeIds.includes(article.typeId));
  }

  filterFieldValues(articles: Article[]): Article[] {
    let result = articles;

    const fieldValueFilters = this.filtersAndSorting.filters.fieldValues;
    const fieldValueFilterType = this.filtersAndSorting.filters.fieldValuesFilterType;

    if (!fieldValueFilters || fieldValueFilters.length === 0) {
      return result;
    }

    result = articles.filter(article => {
      if (!article.additionalFieldValueIds || article.additionalFieldValueIds.length === 0) {
        return false;
      }

      const articleFieldNameValues = [];
      for (const articleFieldValueId of article.additionalFieldValueIds) {
        const fieldValue = this.articleFieldValueQuery.getEntity(articleFieldValueId);
        const fieldName = this.articleFieldNameQuery.getEntity(fieldValue.fieldNameId);

        if (fieldValueFilterType === FilterType.Any) {
          if (fieldValueFilters.some(fieldValueFilter => fieldValueFilter.name.toLowerCase() === fieldName.name.toLowerCase() &&
                                                         fieldValueFilter.value.toLowerCase() === fieldValue.value.toLowerCase())) {
            return true;
          }
        } else {
          articleFieldNameValues.push({name: fieldName.name, value: fieldValue.value});
        }
      }

      if (fieldValueFilterType === FilterType.All) {
        return fieldValueFilters.every(fieldValueFilter =>
          articleFieldNameValues.some(articleField => articleField.name.toLowerCase() === fieldValueFilter.name.toLowerCase() &&
                                                      articleField.value.toLowerCase() === fieldValueFilter.value.toLowerCase())
        );
      } else {
        return false;
      }
    });

    return result;
  }

  filterFastSearch(articles: Article[]): Article[] {
    const fastSearch = this.filtersAndSorting.filters.fastSearch;

    if (!fastSearch) {
      return articles;
    }

    return articles.filter(article => {
      if (article.name && article.name.toLowerCase().includes(fastSearch.toLowerCase())) {
        return true;
      }

      if (article.additionalFieldValueIds && article.additionalFieldValueIds.length > 0) {
        const fieldValues = this.articleFieldValueQuery.getAll({
          filterBy: fieldValue => article.additionalFieldValueIds.includes(fieldValue.id)
        });

        if (fieldValues.some(fieldValue => fieldValue.value.toLowerCase().includes(fastSearch.toLowerCase()))) {
          return true;
        }
      }

      // if (article.text.toLowerCase().includes(fastSearch.toLowerCase())) {
      //   return true;
      // }

      return false;
    });
  }

  onFastSearch() {
    if (!this.fastSearchString || this.fastSearchString.length === 0) {
      this.articlesUiStore.updateFastSearch(null);
    } else {
      this.articlesUiStore.updateFastSearch(this.fastSearchString);
    }
  }

  onFastSearchInput(event: KeyboardEvent) {
    if (event.keyCode === 13) { // enter
      event.stopPropagation(); // don't submit the form
      this.onFastSearch();
    }
  }

  sort(articles: Article[]): Article[] {
    if (!this.filtersAndSorting.sorting ||
        !this.filtersAndSorting.sorting.sortItems ||
        this.filtersAndSorting.sorting.sortItems.length === 0) {
      return articles;
    }
    return articles.sort((article1, article2) => {
      let article1Fields = null;
      let article2Fields = null;

      for (const sortItem of this.filtersAndSorting.sorting.sortItems) {
        switch (sortItem.sortItemType) {
          case SortItemType.ArticleType:
            const articleType1 = this.articleTypeQuery.getEntity(article1.typeId);
            const articleType2 = this.articleTypeQuery.getEntity(article2.typeId);
            if (articleType1 === articleType2) {
              if (article1.isSectionHeader === article2.isSectionHeader) {
                continue;
              } else {
                const result = article1.isSectionHeader ? -1 : 1;
                return sortItem.sortOrder === SortOrder.Asc ?  result : -result;
              }
            } else {
              const result = articleType1.sortingOrder - articleType2.sortingOrder;
              return sortItem.sortOrder === SortOrder.Asc ?  result : -result;
            }
          case SortItemType.ArticleName:
            if (article1.name.toLowerCase() === article2.name.toLowerCase()) {
              continue;
            } else {
              const result = article1.name.toLowerCase().localeCompare(article2.name.toLowerCase());
              return sortItem.sortOrder === SortOrder.Asc ?  result : -result;
            }
          case SortItemType.ArticleField:
            if (!article1Fields) {
              article1Fields = this.getAdditionalArticleFields(article1);
            }
            if (!article2Fields) {
              article2Fields = this.getAdditionalArticleFields(article2);
            }

            let fieldValue1 = article1Fields.find(nameValuePair => nameValuePair.name === sortItem.sortItemName.toLowerCase());
            let fieldValue2 = article2Fields.find(nameValuePair => nameValuePair.name === sortItem.sortItemName.toLowerCase());
            if (fieldValue1) {
              fieldValue1 = fieldValue1.value;
            }
            if (fieldValue2) {
              fieldValue2 = fieldValue2.value;
            }

            if (!fieldValue1 && !fieldValue2) {
              continue;
            } else if (!fieldValue1 && fieldValue2) {
              return sortItem.sortOrder === SortOrder.Asc ?  1 : -1;
            } else if (fieldValue1 && !fieldValue2) {
              return sortItem.sortOrder === SortOrder.Asc ?  -1 : 1;
            } else {
              const result = fieldValue1.toLowerCase().localeCompare(fieldValue2.toLowerCase());
              return sortItem.sortOrder === SortOrder.Asc ?  result : -result;
            }
        }
      }

      return 0;
    });
  }

  getAdditionalArticleFields(article: Article) {
    const additionalFields = [];

    if (article != null) {
      const articleType = this.articleTypeQuery.getEntity(article.typeId);
      const additionalFieldNames = this.articleFieldNameQuery.getAll({
            filterBy: value => articleType.articleFieldNameIds.includes(value.id), sortBy: 'orderNo'
      });

      if (article.additionalFieldValueIds != null && article.additionalFieldValueIds.length > 0) {
        const additionalFieldValues = this.articleFieldValueQuery.getAll({
          filterBy: fieldValue => article.additionalFieldValueIds.includes(fieldValue.id)
        });

        for (const additionalFieldName of additionalFieldNames) {
          const existingValue = additionalFieldValues.find(value => value.fieldNameId === additionalFieldName.id);
          additionalFields.push({
              name: additionalFieldName.name.toLowerCase(),
              value: existingValue ? existingValue.value.toLowerCase() : null
          });
        }
      }
    }

    return additionalFields;
  }

  isSideViewSelected(sideView: SideView) {
    return this.sidePanelState.selectedSideView === sideView;
  }

  selectSideView(sideView: SideView) {
    if (!this.sidePanelState.sidePanelExpanded) {
      this.sidePanelState.sidePanelExpanded = true;
    }

    if (this.sidePanelState.selectedSideView !== sideView) {
      this.sidePanelState.selectedSideView = sideView;
    }

    this.articlesUiStore.updateFilterPanelState(this.sidePanelState);
  }

  collapseSidePanel() {
    this.sidePanelState.sidePanelExpanded = false;
    this.articlesUiStore.updateFilterPanelState(this.sidePanelState);
  }
}
