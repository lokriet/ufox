import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { guid } from '@datorama/akita';
import { ArticleTagService } from '../../articles-setup/state/article-tag.service';
import { ArticleTagQuery } from '../../articles-setup/state/article-tag.query';
import { ArticleTag } from '../../articles-setup/state/article-tag.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-tags',
  templateUrl: './edit-tags.component.html',
  styleUrls: ['./edit-tags.component.scss']
})
export class EditTagsComponent implements OnInit {
  @ViewChild('createTagInput', { static: true }) createTagInput: ElementRef;
  @Input() enabled: boolean;
  tags$: Observable<ArticleTag[]>;
  @Output() viewClosed = new EventEmitter();
  @Output() tagDeleted = new EventEmitter<string>();

  constructor(private tagService: ArticleTagService,
              private tagQuery: ArticleTagQuery) { }

  ngOnInit() {
    this.tags$ = this.tagQuery.selectAll();
  }

  onRemoveTag(selectedTagId: string) {
    this.tagService.remove(selectedTagId);
    console.log('removed ' + selectedTagId);
    this.tagDeleted.emit(selectedTagId);
  }

  onCreateTag(tagName: string) {
    this.tagService.add({id: guid(), name: tagName});
    this.createTagInput.nativeElement.value = '';
  }

  onCloseView() {
    this.viewClosed.emit();
  }
}
