import { AfterViewChecked, AfterViewInit, Component, DoCheck, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom, max, Subscription, take } from 'rxjs';
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
export class AddPlayersComponent implements OnInit, OnDestroy {
  public sid: string = "";
  public onlineCheck: boolean = false;
  public nameForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9åäöÅÄÖ]{3,20}')]],
    maxPlayers: ['', [Validators.required]]
  })

  private subOnlineCheck$: Subscription = new Subscription;
  private subUserId$: Subscription = new Subscription;

  constructor(
    private _router: Router, 
    private diceService: DiceService, 
    private scoreService: ScoreService, 
    private socketService: SocketService, 
    private formBuilder: FormBuilder, 
    private playerService: PlayerService
  ) {}

  /**
   * Retrieves the clients socket ID from the backend.
   * Fetches wether backend is online or not
   * @date 2023-02-02 - 12:41:07
   * @author Christopher Reineborn
   */
  ngOnInit(): void {
    this.socketService.triggerOnlineCheck(true);
    this.subOnlineCheck$ = this.socketService.getOnlineCheck().subscribe(online => {
      this.onlineCheck = online;
    })

    this.subUserId$ = this.socketService.getUserID().subscribe(userID => {
      this.sid = userID;
    })
  }

  ngOnDestroy(): void {
    this.subOnlineCheck$.unsubscribe();
    this.subUserId$.unsubscribe();
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
    if(this.nameForm.valid && this.onlineCheck){
      const name = this.nameForm.controls['name'].value!;
      const clientPlayer = new Player(name, this.sid, false, new ScoreBoard(this.diceService, this.scoreService));
      const maxPlayers = Number(this.nameForm.controls['maxPlayers'].value)
      this.playerService.setChosenMaxPlayers(maxPlayers);
      if(maxPlayers > 1){
        this.socketService.joinRoom(name, maxPlayers);
      }
      if(maxPlayers === 1){

      }
      this.nameForm.patchValue({
        name: "",
        maxPlayers: ""
      });

      

      this.playerService.setClientPlayer(clientPlayer);
      this._router.navigate(['game'], {skipLocationChange: true});

    }
  }
  


}
