import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ID, guid } from '@datorama/akita';
import { ArticleTagService } from '../articles-setup/state/article-tag.service';
import { ArticleTagQuery } from '../articles-setup/state/article-tag.query';
import { ArticleTagStore } from '../articles-setup/state/article-tag.store';
import { ArticleTag } from '../articles-setup/state/article-tag.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-tags',
  templateUrl: './edit-tags.component.html',
  styleUrls: ['./edit-tags.component.scss']
})
export class EditTagsComponent implements OnInit {
  @ViewChild('createTagInput') createTagInput: ElementRef;
  @Input() enabled: boolean;
  tags$: Observable<ArticleTag[]>;
  @Output() viewClosed = new EventEmitter();

  constructor(private tagService: ArticleTagService,
              private tagQuery: ArticleTagQuery,
              private tagStore: ArticleTagStore) { }

  ngOnInit() {
    this.tagService.syncCollection().subscribe();
    this.tags$ = this.tagQuery.selectAll();
  }

  onRemoveTag(selectedTagId: string) {
    this.tagService.remove(selectedTagId);
    // this.tagStore.remove(selectedTagId);
    console.log('removed ' + selectedTagId);
  }

  onCreateTag(tagName: string) {
    // this.tagStore.add({id: guid(), name: tagName});
    this.tagService.add({id: guid(), name: tagName});
    this.createTagInput.nativeElement.value = '';
  }

  onCloseView() {
    this.viewClosed.emit();
  }
}
