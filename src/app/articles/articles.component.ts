import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ArticleFieldNameQuery } from '../articles-setup/state/article-field-name.query';
import { ArticleTagQuery } from '../articles-setup/state/article-tag.query';
import { ArticleTypeQuery } from '../articles-setup/state/article-type.query';
import { ArticleFieldValueQuery } from './state/article-field-value.query';
import { ArticlesUiQuery } from './state/article-ui.query';
import { ArticlesUiState, FilterType } from './state/article-ui.store';
import { Article } from './state/article.model';
import { ArticleQuery } from './state/article.query';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
  loadingArticles$: Observable<boolean>;
  loadingFieldNames$: Observable<boolean>;
  loadingFieldValues$: Observable<boolean>;
  loadingTags$: Observable<boolean>;
  loadingArticleTypes$: Observable<boolean>;

  allArticles: Article[];
  filteredArticles: Article[];
  filtersAndSorting: ArticlesUiState;

  filterPanelExpanded = true;

  constructor(private articleQuery: ArticleQuery,
              private articleUiQuery: ArticlesUiQuery,
              private articleFieldNameQuery: ArticleFieldNameQuery,
              private articleFieldValueQuery: ArticleFieldValueQuery,
              private articleTagQuery: ArticleTagQuery,
              private articleTypeQuery: ArticleTypeQuery) {}

  ngOnInit(): void {
    this.loadingArticles$ = this.articleQuery.selectLoading();
    this.loadingFieldNames$ = this.articleFieldNameQuery.selectLoading();
    this.loadingFieldValues$ = this.articleFieldValueQuery.selectLoading();
    this.loadingTags$ = this.articleTagQuery.selectLoading();
    this.loadingArticleTypes$ = this.articleTypeQuery.selectLoading();

    this.articleQuery.selectAll().subscribe(articles => this.allArticles = articles);
    this.articleUiQuery.select().subscribe(value => {
      this.filtersAndSorting = value;
      this.filteredArticles = this.applyFiltersAndSorting();
    });
  }


  applyFiltersAndSorting(): Article[] {
    let result = this.allArticles;
    if (this.filtersAndSorting != null && this.allArticles !== null) {
      result = this.filterByTags(this.allArticles);
      result = this.filterByArticleTypes(result);
      result = this.filterFieldValues(result);
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
}
