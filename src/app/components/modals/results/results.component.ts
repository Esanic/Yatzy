import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Player } from 'src/app/models/player';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  @Input() players!: Player[];

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
