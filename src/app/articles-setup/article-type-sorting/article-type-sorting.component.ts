import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ArticleType } from '../state/article-type.model';
import { ArticleTypeQuery } from '../state/article-type.query';
import { ArticleTypeService } from '../state/article-type.service';

@Component({
  selector: 'app-article-type-sorting',
  templateUrl: './article-type-sorting.component.html',
  styleUrls: ['./article-type-sorting.component.scss']
})
export class ArticleTypeSortingComponent implements OnInit {
  loadingArticleTypes$: Observable<boolean>;
  articleTypes: ArticleType[];

  constructor(private articleTypeQuery: ArticleTypeQuery,
              private articleTypeService: ArticleTypeService) { }

  ngOnInit() {
    this.loadingArticleTypes$ = this.articleTypeQuery.selectLoading();
    this.articleTypeQuery.selectAll({sortBy: 'sortingOrder'}).subscribe(articleTypes => {
      this.articleTypes = [];
      for (const articleType of articleTypes) {
        this.articleTypes.push({...articleType});
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    const previousSortingOrder = this.articleTypes[event.previousIndex].sortingOrder;
    this.articleTypes[event.previousIndex].sortingOrder = this.articleTypes[event.currentIndex].sortingOrder;
    this.articleTypes[event.currentIndex].sortingOrder = previousSortingOrder;

    this.articleTypeService.update(this.articleTypes[event.previousIndex]);
    this.articleTypeService.update(this.articleTypes[event.currentIndex]);

    // moveItemInArray(this.articleTypes, event.previousIndex, event.currentIndex);
  }

}
