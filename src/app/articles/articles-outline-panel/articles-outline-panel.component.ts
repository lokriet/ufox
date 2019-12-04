import { Component, Input, OnInit } from '@angular/core';

import { Article } from '../state/articles/article.model';
import { ArticlesUiQuery } from '../state/ui/article-ui.query';
import { ArticleSectionQuery } from 'src/app/article-sections/state/article-section.query';
import { SortItemType } from '../state/ui/article-ui.store';

@Component({
  selector: 'app-articles-outline-panel',
  templateUrl: './articles-outline-panel.component.html',
  styleUrls: ['./articles-outline-panel.component.scss']
})
export class ArticlesOutlinePanelComponent implements OnInit {
  @Input() articles: Article[];

  showSectionNames = false;


  constructor(private filtersQuery: ArticlesUiQuery,
              private sectionsQuery: ArticleSectionQuery) { }

  ngOnInit() {
    this.filtersQuery.select().subscribe(value => {
      if (value.sorting.sortItems &&
          value.sorting.sortItems.length > 0 &&
          value.sorting.sortItems[0].sortItemType === SortItemType.ArticleSection) {
        this.showSectionNames = true;
      } else {
        this.showSectionNames = false;
      }
    });

  }

  scrollToArticle(articleId: string) {
    document.getElementById(articleId).scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  }

  getSectionName(article: Article) {
    if (article.sectionId) {
      return this.sectionsQuery.getEntity(article.sectionId).name;
    } else {
      return '';
    }
  }
}
