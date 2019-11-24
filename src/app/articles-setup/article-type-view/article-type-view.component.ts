import { Component, OnInit, Input } from '@angular/core';
import { ArticleType } from '../state/article-type.model';
import { ArticleTagQuery } from '../state/article-tag.query';
import { ArticleTagService } from '../state/article-tag.service';
import { ArticleFieldNameQuery } from '../state/article-field-name.query';
import { ArticleFieldNameService } from '../state/article-field-name.service';
import { Observable } from 'rxjs';
import { ArticleTag } from '../state/article-tag.model';
import { ArticleFieldName } from '../state/article-field-name.model';

@Component({
  selector: 'app-article-type-view',
  templateUrl: './article-type-view.component.html',
  styleUrls: ['./article-type-view.component.scss']
})
export class ArticleTypeViewComponent implements OnInit {
  @Input() articleType: ArticleType;

  tags$: Observable<ArticleTag[]>;
  fieldNames$: Observable<ArticleFieldName[]>;

  constructor(private tagsQuery: ArticleTagQuery,
              private fieldNamesQuery: ArticleFieldNameQuery
  ) { }

  ngOnInit() {
    this.tags$ = this.tagsQuery.selectAll({
      filterBy: entity => this.articleType.defaultTagIds.includes(entity.id)
    });

    this.fieldNames$ = this.fieldNamesQuery.selectAll({
      filterBy: entity => this.articleType.articleFieldNameIds.includes(entity.id)
    });
  }

}
