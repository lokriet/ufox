import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  @Input() question = 'Are you sure?';
  @Input() yesAnswer = 'Yes';
  @Input() noAnswer = 'No';
  @Output() reply = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  onYesClicked() {
    this.reply.emit(true);
  }

  onNoClicked() {
    this.reply.emit(false);
  }

}
