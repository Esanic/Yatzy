import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-set-score-confirmation',
  templateUrl: './set-score-confirmation.component.html',
  styleUrls: ['./set-score-confirmation.component.css']
})
export class SetScoreConfirmationComponent implements OnInit {
  @Input() scoreRow: string = "";

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
