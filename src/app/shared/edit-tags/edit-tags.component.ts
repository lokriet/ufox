import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import { guid } from '@datorama/akita';
import { Observable } from 'rxjs';
import { ArticleQuery } from 'src/app/articles/state/articles/article.query';
import { ArticleService } from 'src/app/articles/state/articles/article.service';

import { ArticleTag } from '../../articles-setup/state/article-tag.model';
import { ArticleTagQuery } from '../../articles-setup/state/article-tag.query';
import { ArticleTagService } from '../../articles-setup/state/article-tag.service';

@Component({
  selector: 'app-edit-tags',
  templateUrl: './edit-tags.component.html',
  styleUrls: ['./edit-tags.component.scss']
})
export class EditTagsComponent implements OnInit, OnDestroy {
  @ViewChild('createTagInput', { static: true }) createTagInput: ElementRef;
  @ViewChild('dialogBoxDiv', { static: false }) dialogBoxDiv: ElementRef;

  tags$: Observable<ArticleTag[]>;
  @Output() viewClosed = new EventEmitter();
  @Output() tagDeleted = new EventEmitter<string>();

  isDown = false;
  dragOffset: any;

  @Input() enabled: boolean;
  boundEventListener = this.escapeEvent.bind(this);

  constructor(private tagService: ArticleTagService,
              private tagQuery: ArticleTagQuery,
              private articleService: ArticleService,
              private articleQuery: ArticleQuery) { }

  ngOnInit() {
    this.tags$ = this.tagQuery.selectAll({sortBy: 'name'});
    document.addEventListener('keydown', this.boundEventListener);
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.boundEventListener);
  }

  onRemoveTag(selectedTagId: string) {
    const articles = this.articleQuery.getAll({filterBy: value => value.tagIds != null && value.tagIds.includes(selectedTagId)});
    if (articles != null && articles.length > 0) {
      if (confirm(`AAAAAAAH!!!! There are ${articles.length} articles with this tag. Are you sure you want to delete it?`)) {
        for (const article of articles) {
          const newArticle = {...article};
          newArticle.tagIds = article.tagIds.filter(value => value !== selectedTagId);
          this.articleService.update(newArticle);
        }

        this.tagService.remove(selectedTagId);
        this.tagDeleted.emit(selectedTagId);
      }
    } else {
      this.tagService.remove(selectedTagId);
      this.tagDeleted.emit(selectedTagId);
    }

  }

  onTagNameKeydown(event: KeyboardEvent, tagName: string) {
    if (event.keyCode === 13) { // enter
      event.stopPropagation(); // don't submit the form
      this.onCreateTag(tagName);
    }
  }

  onCreateTag(tagName: string) {
    this.tagService.add({id: guid(), name: tagName});
    this.createTagInput.nativeElement.value = '';
  }

  onCloseView() {
    this.viewClosed.emit();
  }

  mousedown($event){
    this.isDown = true;
    this.dragOffset = [
        this.dialogBoxDiv.nativeElement.offsetLeft - $event.clientX,
        this.dialogBoxDiv.nativeElement.offsetTop - $event.clientY
    ]
}

  mouseup($event){
      this.isDown = false;
  }

  mousemove($event){
      $event.preventDefault();

      if (this.isDown) {
          const mousePosition = {
              x : $event.clientX,
              y : $event.clientY
          };

          this.dialogBoxDiv.nativeElement.style.left = (mousePosition.x + this.dragOffset[0]) + 'px';
          this.dialogBoxDiv.nativeElement.style.top  = (mousePosition.y + this.dragOffset[1]) + 'px';
      }
  }

  // 
  // @Input() set enabled(enabled: boolean) {
  //   if (enabled && !this.enabled)  {
  //     this.enabled = true;
  //     document.addEventListener('keydown', this.boundEventListener);
  //   }
  //   if (!enabled && this.enabled) {
  //     this.enabled = false;
  //     document.removeEventListener('keydown', this.boundEventListener)
  //   }
  // }

  
  escapeEvent(event) {
    if (this.enabled && event.key === 'Escape' || event.keyCode === 27) {
      this.onCloseView();
    }
  }

}
