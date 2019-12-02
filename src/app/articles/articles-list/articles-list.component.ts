import { Component, Input, OnInit } from '@angular/core';

import { Article } from '../state/articles/article.model';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.scss']
})
export class ArticlesListComponent implements OnInit {
  @Input() articles: Article[];

  constructor() { }

  ngOnInit() {
  }

}
