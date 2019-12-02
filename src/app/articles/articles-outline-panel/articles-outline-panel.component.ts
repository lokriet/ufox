import { Component, Input, OnInit } from '@angular/core';

import { Article } from '../state/articles/article.model';

@Component({
  selector: 'app-articles-outline-panel',
  templateUrl: './articles-outline-panel.component.html',
  styleUrls: ['./articles-outline-panel.component.scss']
})
export class ArticlesOutlinePanelComponent implements OnInit {
  @Input() articles: Article[];

  constructor() { }

  ngOnInit() {
  }

  scrollToArticle(articleId: string) {
    document.getElementById(articleId).scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    // }
  }

}
