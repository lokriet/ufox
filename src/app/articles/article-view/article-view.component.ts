import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../state/article.model';

@Component({
  selector: 'app-article-view',
  templateUrl: './article-view.component.html',
  styleUrls: ['./article-view.component.scss']
})
export class ArticleViewComponent implements OnInit {
  @Input() article: Article;

  constructor() { }

  ngOnInit() {
  }

  stringify() {
    return JSON.stringify(this.article, null, 2);
  }

}
