import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Participant } from 'src/app/models/participant';
import { ScoreBoard } from 'src/app/models/score-board';
import { DiceService } from 'src/app/services/dice.service';
import { ParticipantService } from 'src/app/services/participant.service';
import { ScoreService } from 'src/app/services/score.service';
import { SocketService } from 'src/app/services/socket.service';

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

  constructor(private diceService: DiceService, private scoreService: ScoreService, private socketService: SocketService, private formBuilder: FormBuilder, private participantService: ParticipantService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.participantService.getDisableAddPlayers().subscribe(bool => {
      this.disableButton = bool;
    })
  }

  public setName(): void {
    let name = this.names.value.name?.toString();
    name != undefined ? this.socketService.participants(name) : null;
    this.names.setValue({name: ""});
    this.participantCounter == 3 ? this.disableButton = true : this.participantCounter++
  }

  public addPlayerButton(): void {
    this.modalService.open(this.addPlayer);
  }

}
