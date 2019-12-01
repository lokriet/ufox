import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { faCheck, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { ArticleTag } from 'src/app/articles-setup/state/article-tag.model';
import { ArticleTagQuery } from 'src/app/articles-setup/state/article-tag.query';
import { ArticleType } from 'src/app/articles-setup/state/article-type.model';
import { ArticleTypeQuery } from 'src/app/articles-setup/state/article-type.query';

import { ArticlesUiQuery } from '../state/article-ui.query';
import { ArticlesUiStore, FieldValueFilter, FilterType, SortItem, SortItemType, SortOrder, FilterPanelState } from '../state/article-ui.store';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-articles-filter-panel',
  templateUrl: './articles-filter-panel.component.html',
  styleUrls: ['./articles-filter-panel.component.scss'],
  animations: [
    trigger('collapse', [
      state('subsectionCollapsed', style({ height: '0px' })),
      state('subsectionExpanded', style({ height: '*' })),
      transition('subsectionCollapsed <=> subsectionExpanded', [animate('1s')])
    ])
  ]
})
export class ArticlesFilterPanelComponent implements OnInit {
  faTimes = faTimes;
  faRight = faChevronRight;
  faCheck = faCheck;

  filterTags: ArticleTag[] = [];
  tagsFilterType: FilterType;

  allTags$: Observable<ArticleTag[]>;
  // tagsFiltersExpanded = true;

  filterArticleTypeIds: string[] = [];
  allArticleTypes$: Observable<ArticleType[]>;
  // typeFiltersExpanded = true;

  fieldValuesFilterType: FilterType;
  fieldValueFilters: FieldValueFilter[];
  showFieldValuesFilterError = false;
  // fieldFiltersExpanded = true;

  sorting: SortItem[];
  showFieldValueSortingError = false;
  // sortingOrderExpanded = true;
  // sortingFieldsExpanded = false;

  panelState: FilterPanelState;

  constructor(private tagsQuery: ArticleTagQuery,
              private articlesUiQuery: ArticlesUiQuery,
              private articlesUiStore: ArticlesUiStore,
              private articleTypesQuery: ArticleTypeQuery) { }

  ngOnInit() {
    this.allTags$ = this.tagsQuery.selectAll({sortBy: 'name'});
    this.allArticleTypes$ = this.articleTypesQuery.selectAll({sortBy: 'sortingOrder'});

    this.articlesUiQuery.select().subscribe(value => {
      this.filterTags = this.tagsQuery.getAll({
        filterBy: entity => value.filters.tagIds.includes(entity.id)
      });

      this.tagsFilterType = value.filters.tagsFilterType;

      this.filterArticleTypeIds = [...value.filters.articleTypeIds];

      this.fieldValuesFilterType = value.filters.fieldValuesFilterType;
      this.fieldValueFilters = [];
      for (const fieldValue of value.filters.fieldValues) {
        this.fieldValueFilters.push({...fieldValue});
      }


      this.sorting = [];
      for (const sortItem of value.sorting.sortItems) {
        this.sorting.push({...sortItem});
      }

      this.panelState = {...value.filterPanelState};
    });
  }

  filtersEmpty(): boolean {
    if (this.filterTags && this.filterTags.length > 0) {
       return false;
    }

    if (this.filterArticleTypeIds && this.filterArticleTypeIds.length > 0) {
      return false;
    }

    if (this.fieldValueFilters && this.fieldValueFilters.length > 0) {
      return false;
    }

    return true;
  }

  onDeleteFilterTag(i: number) {
    this.filterTags.splice(i, 1);
    this.articlesUiStore.updateFilterTags(this.filterTags.map(tag => tag.id));
  }

  onAddFilterTag(tagId: string) {
    const tag = this.tagsQuery.getEntity(tagId);
    if (!this.filterTags.includes(tag)) {
      this.filterTags.push(tag);
      this.articlesUiStore.updateFilterTags(this.filterTags.map(filterTag => filterTag.id));
    }
  }

  onTagsFilterTypeChanged(tagsFilterType: FilterType) {
    this.tagsFilterType = tagsFilterType;
    this.articlesUiStore.updateTagsFilterType(this.tagsFilterType);
  }

  onClearAllFilters() {
    this.articlesUiStore.resetFilters();
  }

  isInFilterList(articleTypeId: string) {
    return this.filterArticleTypeIds.includes(articleTypeId);
  }

  onChangeArticleTypeFilter(articleTypeId: string) {
    if (this.isInFilterList(articleTypeId)) {
      this.filterArticleTypeIds = this.filterArticleTypeIds.filter(id => id !== articleTypeId);
    } else {
      this.filterArticleTypeIds.push(articleTypeId);
    }

    this.articlesUiStore.updateFilterArticleTypes(this.filterArticleTypeIds);
  }

  onFieldValuesFilterTypeChanged(fieldValuesFilterType: FilterType) {
    const saveFieldValueFilters = this.fieldValueFilters;
    this.fieldValuesFilterType = fieldValuesFilterType;
    this.articlesUiStore.updateFieldValuesFilterType(this.fieldValuesFilterType);
    this.fieldValueFilters = saveFieldValueFilters;
  }

  onAddFieldValueFilter() {
    this.fieldValueFilters.push({name: '', value: ''});
  }

  onDeleteFieldValueFilter(i: number) {
    this.fieldValueFilters.splice(i, 1);

    if (this.allFieldsFilled()) {
      this.articlesUiStore.updateFilterFieldValues(this.fieldValueFilters);
    }
  }

  onSaveFieldValueFilters() {
    if (this.allFieldsFilled()) {
      this.articlesUiStore.updateFilterFieldValues(this.fieldValueFilters);
      this.showFieldValuesFilterError = false;
    } else {
      this.showFieldValuesFilterError = true;
    }
  }

  allFieldsFilled(): boolean {
    let allFieldsFilled = true;
    for (const fieldValueFilter of this.fieldValueFilters) {
      if (fieldValueFilter.name === null ||
          fieldValueFilter.name === '' ||
          fieldValueFilter.value === null ||
          fieldValueFilter.value === '') {
        allFieldsFilled = false;
        break;
      }
    }
    return allFieldsFilled;
  }

  sortingTypeAdded(sortItemType: SortItemType): boolean {
    return this.sorting && this.sorting.some(sortItem => sortItem.sortItemType === sortItemType);
  }

  addSorting(sortItemType: SortItemType, sortOrder: SortOrder, sortItemName: string) {
    if (!this.sorting) {
      this.sorting = [];
    }

    if (sortItemType === SortItemType.ArticleField && !sortItemName) {
      this.showFieldValueSortingError = true;
      return;
    } else {
      this.showFieldValueSortingError = false;
      this.sorting.push({sortItemType, sortOrder, sortItemName});
      this.articlesUiStore.updateSortingOrder(this.sorting);
    }
  }

  onRemoveSortingOrderItem(i: number) {
    this.sorting.splice(i, 1);
    this.articlesUiStore.updateSortingOrder(this.sorting);
  }

  onSortItemDrop(event: CdkDragDrop<string[]>) {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    moveItemInArray(this.sorting, event.previousIndex, event.currentIndex);
    this.articlesUiStore.updateSortingOrder(this.sorting);
  }

  switchSortOrder(i: number) {
    if (this.sorting[i].sortOrder === SortOrder.Asc) {
      this.sorting[i].sortOrder = SortOrder.Desc;
    } else {
      this.sorting[i].sortOrder = SortOrder.Asc;
    }
    this.articlesUiStore.updateSortingOrder(this.sorting);
  }

  capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  onResetSorting() {
    this.articlesUiStore.resetSorting();
    this.showFieldValuesFilterError = false;
  }

  switchTypeFiltersExpanded() {
    this.panelState.typeFiltersExpanded = !this.panelState.typeFiltersExpanded;
    this.articlesUiStore.updateFilterPanelState(this.panelState);
  }

  switchTagFiltersExpanded() {
    this.panelState.tagsFiltersExpanded = !this.panelState.tagsFiltersExpanded;
    this.articlesUiStore.updateFilterPanelState(this.panelState);
  }

  switchFieldFiltersExpanded() {
    this.panelState.fieldFiltersExpanded = !this.panelState.fieldFiltersExpanded;
    this.articlesUiStore.updateFilterPanelState(this.panelState);
  }

  switchSortingOrderExpanded() {
    this.panelState.sortingOrderExpanded = !this.panelState.sortingOrderExpanded;
    this.articlesUiStore.updateFilterPanelState(this.panelState);
  }

  switchSortingFieldsExpanded() {
    this.panelState.sortingFieldsExpanded = !this.panelState.sortingFieldsExpanded;
    this.articlesUiStore.updateFilterPanelState(this.panelState);
  }
}
