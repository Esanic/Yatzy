import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParticipantService } from 'src/app/services/participant.service';

@Component({
  selector: 'app-add-players',
  templateUrl: './add-players.component.html',
  styleUrls: ['./add-players.component.css']
})
export class AddPlayersComponent implements OnInit {
  public names = this.formBuilder.group({
    name: ''
  })

  @ViewChild('addPlayer', {read: TemplateRef}) addPlayer!: TemplateRef<any>;

  public disableButton: boolean = false;
  public participantCounter: number = 0;

  constructor(private formBuilder: FormBuilder, private participantService: ParticipantService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.participantService.getDisableAddPlayers().subscribe(bool => {
      this.disableButton = bool;
    })
  }

  public setName(): void {
    let name = this.names.value.name?.toString();
    name != undefined ? this.participantService.setParticipant(name) : null
    this.names.setValue({name: ""});
    this.participantCounter == 3 ? this.disableButton = true : this.participantCounter++
  }

  public addPlayerButton(): void {
    this.modalService.open(this.addPlayer);
  }

}
