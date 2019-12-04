import { Component, OnInit } from '@angular/core';
import { guid } from '@datorama/akita';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';

import { ArticleQuery } from '../articles/state/articles/article.query';
import { ArticleService } from '../articles/state/articles/article.service';
import { ArticleSection } from './state/article-section.model';
import { ArticleSectionQuery } from './state/article-section.query';
import { ArticleSectionService } from './state/article-section.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-article-sections',
  templateUrl: './article-sections.component.html',
  styleUrls: ['./article-sections.component.scss']
})
export class ArticleSectionsComponent implements OnInit {
  faTimes = faTimes;

  articleSections: ArticleSection[];
  articleSectionsLoading$: Observable<boolean>;
  articlesLoading$: Observable<boolean>;

  editedSectionIndex: number;
  editedSectionName: string;

  newSectionName: string;

  constructor(private articleSectionQuery: ArticleSectionQuery,
              private articleSectionService: ArticleSectionService,
              private articleQuery: ArticleQuery,
              private articleService: ArticleService) { }

  ngOnInit() {
    this.articleSectionsLoading$ = this.articleSectionQuery.selectLoading();
    this.articlesLoading$ = this.articleQuery.selectLoading();

    this.articleSections = [];

    this.articleSectionQuery.selectAll({sortBy: 'orderNo'}).subscribe(allSections => {
      this.articleSections = [];
      for (const section of allSections) {
        this.articleSections.push({ ...section });
      }
    });

    this.editedSectionIndex = -1;
    this.editedSectionName = null;
  }

  onSectionRename(event) {
    if (event.keyCode === 13) { // enter
      event.stopPropagation(); // don't submit the form
      this.onSaveRenamedSection();
    }
  }

  onSaveRenamedSection() {
    this.articleSections[this.editedSectionIndex].name = this.editedSectionName;
    this.articleSectionService.update(this.articleSections[this.editedSectionIndex]);
    this.editedSectionIndex = -1;
    this.editedSectionName = null;
  }

  onRenameSection(i: number) {
    this.editedSectionIndex = i;
    this.editedSectionName = this.articleSections[i].name;
  }

  onCancelRenamingSection() {
    this.editedSectionIndex = -1;
    this.editedSectionName = null;
  }

  onDeleteSection(index: number) {
    if (!confirm('Delete section?')) {
      return;
    }

    const affectedArticles = this.articleQuery.getAll({filterBy: article => article.sectionId === this.articleSections[index].id});
    if (affectedArticles.length > 0) {
      // tslint:disable-next-line: max-line-length
      if (confirm(`There are ${affectedArticles.length} articles in this section. Their section will become empty. Is that what you want?`)) {
        for (const article of affectedArticles) {
          const updatedArticle = {...article, sectionId: null};
          this.articleService.update(updatedArticle);
        }
        this.deleteSection(index);
      }
    } else {
      this.deleteSection(index);
    }
  }

  private deleteSection(index: number) {
    const deletedOrderNo = this.articleSections[index].orderNo;
    this.articleSectionService.remove(this.articleSections[index].id);
    const articleSectionsToUpdate = this.articleSectionQuery.getAll({filterBy: section => section.orderNo > deletedOrderNo});
    for (const articleSection of articleSectionsToUpdate) {
      this.articleSectionService.update({...articleSection, orderNo: articleSection.orderNo - 1});
    }
  }

  onNewSectionInput(event) {
    if (event.keyCode === 13) { // enter
      event.stopPropagation(); // don't submit the form
      this.onCreateSection();
    }
  }

  onCreateSection() {
    const newSection = {
      id: guid(),
      name: this.newSectionName,
      orderNo: this.articleSections.length
    };
    this.articleSectionService.add(newSection);

    this.newSectionName = '';
  }


  onReorderDrop(event: CdkDragDrop<string[]>) {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    moveItemInArray(this.articleSections, event.previousIndex, event.currentIndex);
    for (let i = Math.min(event.previousIndex, event.currentIndex); i <= Math.max(event.previousIndex, event.currentIndex); i++) {
      this.articleSections[i].orderNo = i;
      this.articleSectionService.update(this.articleSections[i]);
    }
  }
}
