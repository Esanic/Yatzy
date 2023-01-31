import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
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
  public sid: string = "";
  public nameForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9åäöÅÄÖ]{3,20}')]]
  })

  constructor(
    private _router: Router, 
    private diceService: DiceService, 
    private scoreService: ScoreService, 
    private socketService: SocketService, 
    private formBuilder: FormBuilder, 
    private playerService: PlayerService
  ) {}

  /**
   * Retrieves the clients socket ID from the backend with the help of a promise
   * @date 2023-01-31 - 11:36:24
   * @author Christopher Reineborn
   *
   * @async
   * @returns {Promise<void>}
   */
  async ngOnInit(): Promise<void> {
    this.sid = await firstValueFrom(this.socketService.getUserID());
  }

 /**
  * Sets the client player in the playerService.
  * Sends request to backend to join a room.
  * Directs the user to the game component.
  * @date 2023-01-31 - 11:37:00
  * @author Christopher Reineborn
  *
  * @returns {*}
  */
  public setName(): void {
    if(this.nameForm.valid){
      const name = this.nameForm.controls['name'].value!;
      const clientPlayer = new Player(name, this.sid, false, new ScoreBoard(this.diceService, this.scoreService));
      if(name){
        this.playerService.setClientPlayer(clientPlayer);
        this.socketService.joinRoom(name);
        this._router.navigate(['game'], {skipLocationChange: true});
      }
      this.nameForm.setValue({name: ""});
    }
  }
  


}
