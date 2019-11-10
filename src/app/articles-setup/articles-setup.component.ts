import { Component, OnInit } from '@angular/core';
import { ArticleType } from './state/article-type.model';
import { Observable } from 'rxjs';
import { ArticleTypeService } from './state/article-type.service';
import { ArticleTypeQuery } from './state/article-type.query';

@Component({
  selector: 'app-articles-setup',
  templateUrl: './articles-setup.component.html',
  styleUrls: ['./articles-setup.component.scss']
})
export class ArticlesSetupComponent implements OnInit {
  articleTypes$: Observable<ArticleType[]>;

  constructor(private articleTypesService: ArticleTypeService,
              private articleTypesQuery: ArticleTypeQuery) { }

  ngOnInit() {
    this.articleTypesService.syncCollection().subscribe();
    this.articleTypes$ = this.articleTypesQuery.selectAll();
  }

}
