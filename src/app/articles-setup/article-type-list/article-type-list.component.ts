import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ArticleType } from '../state/article-type.model';
import { ArticleTypeService } from '../state/article-type.service';
import { ArticleTypeQuery } from '../state/article-type.query';

@Component({
  selector: 'app-article-type-list',
  templateUrl: './article-type-list.component.html',
  styleUrls: ['./article-type-list.component.scss']
})
export class ArticleTypeListComponent implements OnInit {
  articleTypes$: Observable<ArticleType[]>;

  constructor(private articleTypesService: ArticleTypeService,
              private articleTypesQuery: ArticleTypeQuery) { }

  ngOnInit() {
    this.articleTypesService.syncCollection().subscribe();
    this.articleTypes$ = this.articleTypesQuery.selectAll();
  }
}
