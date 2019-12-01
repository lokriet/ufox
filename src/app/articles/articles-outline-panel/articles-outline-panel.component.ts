import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../state/article.model';

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

}
