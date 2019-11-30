import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faTimes, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { ArticleTag } from 'src/app/articles-setup/state/article-tag.model';
import { ArticleTagQuery } from 'src/app/articles-setup/state/article-tag.query';
import { ArticleType } from 'src/app/articles-setup/state/article-type.model';
import { ArticleTypeQuery } from 'src/app/articles-setup/state/article-type.query';

import { ArticlesUiQuery } from '../state/article-ui.query';
import { ArticlesUiStore, FieldValueFilter, FilterType } from '../state/article-ui.store';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-articles-filter-panel',
  templateUrl: './articles-filter-panel.component.html',
  styleUrls: ['./articles-filter-panel.component.scss'],
  animations: [
    trigger('collapse', [
      state('collapsed', style({ height: 0 })),
      state('expanded', style({ height: '*' })),
      transition('collapsed => expanded', animate('400ms')),
      transition('expanded => collapsed', animate('400ms'))
    ])
  ]
})
export class ArticlesFilterPanelComponent implements OnInit {
  faTimes = faTimes;
  faRight = faChevronRight;

  @Input() expanded = false;
  @Output() expandedChange = new EventEmitter<boolean>();

  filterTags: ArticleTag[] = [];
  tagsFilterType: FilterType;

  allTags$: Observable<ArticleTag[]>;
  tagsFiltersExpanded = true;
  tagsFilterAnimationState = 'expanded';

  filterArticleTypeIds: string[] = [];
  allArticleTypes$: Observable<ArticleType[]>;

  fieldValuesFilterType: FilterType;
  fieldValueFilters: FieldValueFilter[];
  showFieldValuesError = false;

  constructor(private tagsQuery: ArticleTagQuery,
              private articlesUiQuery: ArticlesUiQuery,
              private articlesUiStore: ArticlesUiStore,
              private articleTypesQuery: ArticleTypeQuery) { }

  ngOnInit() {
    this.allTags$ = this.tagsQuery.selectAll();
    this.allArticleTypes$ = this.articleTypesQuery.selectAll();

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
    });
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

  onSwitchExpandedState() {
    this.expanded = !this.expanded;
    this.expandedChange.emit(this.expanded);
  }

  onTagsFilterTypeChanged(tagsFilterType: FilterType) {
    this.tagsFilterType = tagsFilterType;
    this.articlesUiStore.updateTagsFilterType(this.tagsFilterType);
  }

  onClearAllFilters() {
    this.articlesUiStore.reset();
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
    this.fieldValuesFilterType = fieldValuesFilterType;
    this.articlesUiStore.updateFieldValuesFilterType(this.fieldValuesFilterType);
  }

  onAddFieldValueFilter() {
    this.fieldValueFilters.push({name: '', value: ''});
  }

  onDeleteFieldValueFilter(i: number) {
    this.fieldValueFilters.splice(i, 1);
    this.articlesUiStore.updateFilterFieldValues(this.fieldValueFilters);
  }

  onSaveFieldValueFilters() {
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

    if (allFieldsFilled) {
      this.articlesUiStore.updateFilterFieldValues(this.fieldValueFilters);
      this.showFieldValuesError = false;
    } else {
      this.showFieldValuesError = true;
    }
  }

  onTagsSectionExpandSwitched() {
    this.tagsFiltersExpanded = !this.tagsFiltersExpanded;
    this.tagsFilterAnimationState = this.tagsFiltersExpanded ? 'expanded' : 'collapsed';
  }
}
