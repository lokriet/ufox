import { Component, Input, OnInit } from '@angular/core';

import { Article } from '../state/articles/article.model';
import { ArticlesUiQuery } from '../state/ui/article-ui.query';
import { ArticleSectionQuery } from 'src/app/article-sections/state/article-section.query';
import { SortItemType, ArticlesUiStore } from '../state/ui/article-ui.store';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-articles-outline-panel',
  templateUrl: './articles-outline-panel.component.html',
  styleUrls: ['./articles-outline-panel.component.scss'],
  animations: [
    trigger('collapse', [
      state('subsectionCollapsed', style({ height: '0px' })),
      state('subsectionExpanded', style({ height: '*' })),
      transition('subsectionCollapsed <=> subsectionExpanded', [animate('1s')])
    ])
  ]
})
export class ArticlesOutlinePanelComponent implements OnInit {
  faRight = faChevronRight;

  // @Input() articles: Article[];

  _articlesBySection: {key: string, value: Article[]}[];
  _allArticles: Article[];

  showSectionNames = false;
  expandedSectionIds: string[];

  constructor(private uiQuery: ArticlesUiQuery,
              private sectionsQuery: ArticleSectionQuery,
              private uiStore: ArticlesUiStore) { }

  ngOnInit() {
    this.uiQuery.select().subscribe(value => {
      if (value.sorting.sortItems &&
          value.sorting.sortItems.length > 0 &&
          value.sorting.sortItems[0].sortItemType === SortItemType.ArticleSection) {

          this.showSectionNames = true;
          if (this._allArticles && this._allArticles.length > 0) {
            this.articles = this._allArticles;
          }
      } else {
        this.showSectionNames = false;

      }

      this.expandedSectionIds = value.filterPanelState.outlineSectionsExpanded ? [...value.filterPanelState.outlineSectionsExpanded] : [];
    });

    console.log('meow');
  }

  @Input() set articles(newArticles: Article[]) {
    this._allArticles = newArticles;

    if (this.showSectionNames && newArticles && newArticles.length > 0) {
      this._articlesBySection = [];

      let currentSectionId = this.sectionIdString(newArticles[0].sectionId);
      let currentSectionArticles = [];
      for (let i = 0; i < newArticles.length; i++) {
        if (newArticles[i].sectionId === currentSectionId) {
          currentSectionArticles.push(newArticles[i]);
        } else {
          this._articlesBySection.push({key: currentSectionId, value: currentSectionArticles});
          currentSectionId = this.sectionIdString(newArticles[i].sectionId);
          currentSectionArticles = [];
          currentSectionArticles.push(newArticles[i]);
        }

        if (i === newArticles.length - 1) {
          this._articlesBySection.push({key: currentSectionId, value: currentSectionArticles});
        }
      }
    } else {
      this._articlesBySection = null;
    }

  }

  scrollToArticle(articleId: string) {
    document.getElementById(articleId).scrollIntoView({/*behavior: 'smooth', */block: 'start', inline: 'nearest'});
  }

  getSectionName(sectionId: string) {
    return sectionId === 'noname' ? sectionId : this.sectionsQuery.getEntity(sectionId).name;
  }

  sectionIdString(sectionId) {
    return sectionId && sectionId.length > 0 ? sectionId : 'noname';
  }

  // getSectionName(article: Article) {
  //   if (article.sectionId) {
  //     return this.sectionsQuery.getEntity(article.sectionId).name;
  //   } else {
  //     return '';
  //   }
  // }

  isSectionExpanded(sectionId: string) {
    return this.expandedSectionIds && this.expandedSectionIds.includes(sectionId);
  }

  switchSectionsExpanded(sectionId: string) {
    if (!this.expandedSectionIds) {
      this.expandedSectionIds = [];
      this.expandedSectionIds.push(sectionId);
    } else {
      const index = this.expandedSectionIds.indexOf(sectionId);
      if (index >= 0) {
        this.expandedSectionIds.splice(index, 1);
      } else {
        this.expandedSectionIds.push(sectionId);
      }
    }
    this.uiStore.updateExpandedOutlineSections(this.expandedSectionIds);
  }
}
