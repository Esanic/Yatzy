import { AfterViewChecked, AfterViewInit, Component, DoCheck, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, max, Subscription, take } from 'rxjs';
import { Player } from 'src/app/models/player';
import { ScoreBoard } from 'src/app/models/score-board';
import { DiceService } from 'src/app/services/dice.service';
import { PlayerService } from 'src/app/services/player.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-addPlayers',
  templateUrl: './add-players.component.html',
  styleUrls: ['./add-players.component.css']
})
export class AddPlayersComponent implements OnInit, OnDestroy {
  //Misc variables
  public sid: string = "";
  public onlineCheck: boolean = false;
  public queueNumbers: any = {};
  
  //Form
  public nameForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9åäöÅÄÖ\\s-]{2,30}')]],
    maxPlayers: ['', [Validators.required]]
  })

  //Subscriptions
  private onlineCheck$: Subscription = new Subscription;
  private queueNumbers$: Subscription = new Subscription;
  private clientId$: Subscription = new Subscription;

  constructor(
    private router: Router, 
    private diceService: DiceService, 
    private socketService: SocketService, 
    private formBuilder: FormBuilder, 
    private playerService: PlayerService,
    private translateService: TranslateService,
    private modal: NgbModal
  ) {}

  /**
   * Trigger the backend to emit the queue numbers and then retrieves them.
   * Trigger the backend to emit online status and then retrieves it.
   * Retrieves the clients socket ID from the backend.
   *
   * @date 2023-02-02 - 12:41:07
   * @author Christopher Reineborn
   */
  ngOnInit(): void {
    this.socketService.triggerQueueNumbers(true);
    this.queueNumbers$ = this.socketService.getQueueNumbers().subscribe(queueNumbers => {
      this.queueNumbers = queueNumbers;
    })

    this.socketService.triggerOnlineCheck(true);
    this.onlineCheck$ = this.socketService.getOnlineCheck().subscribe(online => {
      this.onlineCheck = online;
    })

    this.clientId$ = this.socketService.getUserID().subscribe(userID => {
      this.playerService.setClientPlayerSid(userID);
    })
  }
  
  /**
   * Unsubscribes from obeservables
   * @date 2023-02-02 - 15:35:04
   * @author Christopher Reineborn
   */
  ngOnDestroy(): void {
    this.onlineCheck$.unsubscribe();
    this.clientId$.unsubscribe();
    this.queueNumbers$.unsubscribe();
    console.log("comp killed");
  }

 /**
  * Creates a new player.
  * Sets the chosen maxplayers in the playerService
  * Sets the clientPlayer in the playerService
  * Asks the backend to join a room if the user has chose more than 1 maxplayers.
  * Resets the form
  * Directs the user to the game component.
  * 
  * @date 2023-01-31 - 11:37:00
  * @author Christopher Reineborn
  *
  * @returns {*}
  */
  public async setName(): Promise<void> {

    if(this.nameForm.valid && this.onlineCheck){
      const name = this.nameForm.controls['name'].value!;
      const clientPlayer = new Player(name, this.playerService.getClientPlayerSidString(), false, new ScoreBoard(this.diceService, this.translateService, this.modal, this.socketService));
      const maxPlayers = Number(this.nameForm.controls['maxPlayers'].value)
      
      this.playerService.setChosenMaxPlayers(maxPlayers);
      this.playerService.setClientPlayer(clientPlayer);
      
      if(maxPlayers > 1){
        this.socketService.joinRoom(name, maxPlayers);
      }
      this.nameForm.reset();

      this.router.navigate(['game'], {skipLocationChange: true});
    }
  }
}
