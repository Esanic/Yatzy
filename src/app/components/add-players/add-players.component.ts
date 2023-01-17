import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Player } from 'src/app/models/player';
import { ScoreBoard } from 'src/app/models/score-board';
import { DiceService } from 'src/app/services/dice.service';
import { PlayerService } from 'src/app/services/player.service';
import { ScoreService } from 'src/app/services/score.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-addPlayers',
  templateUrl: './add-players.component.html',
  styleUrls: ['./add-players.component.css']
})
export class AddPlayersComponent implements OnInit {
  public names = this.formBuilder.group({
    name: ''
  })

  @ViewChild('addPlayer', {read: TemplateRef}) addPlayer!: TemplateRef<any>;

  public disableButton: boolean = false;
  public PlayerCounter: number = 0;

  constructor(private _router: Router, private diceService: DiceService, private scoreService: ScoreService, private socketService: SocketService, private formBuilder: FormBuilder, private PlayerService: PlayerService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.PlayerService.getDisableAddPlayers().subscribe(bool => {
      this.disableButton = bool;
    })
  }

  public setName(): void {
    // this._router.navigate
    let name = this.names.value.name?.toString();
    if(name != undefined){
      this.PlayerService.setClientPlayer(name);
      this.socketService.joinRoom(name);
      this._router.navigate(['game'], {skipLocationChange: true});
    }
    this.names.setValue({name: ""});
    // this.PlayerCounter == 3 ? this.disableButton = true : this.PlayerCounter++
  }

  public addPlayerButton(): void {
    this.modalService.open(this.addPlayer);
  }

}
