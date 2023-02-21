import { Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DefaultLangChangeEvent, LangChangeEvent, TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { Subscription, pipe, take, firstValueFrom } from 'rxjs';
import { yourTurnAnimation } from 'src/app/animations/yourturn.animation';
import { Die } from 'src/app/models/die';
import { Player } from 'src/app/models/player';
import { ScoreBoard } from 'src/app/models/score-board';
import { ClientService } from 'src/app/services/client.service';
import { DiceService } from 'src/app/services/dice.service';
import { PlayerService } from 'src/app/services/player.service';
import { ScoreService } from 'src/app/services/score.service';
import { SocketService } from 'src/app/services/socket.service';


@Component({
  selector: 'app-scoreBoard',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.css'],
  animations: [yourTurnAnimation(1000)]
})
export class ScoreBoardComponent implements OnInit, OnDestroy {
  //Score
  public scoreBoardHeaders = Object.values(this.translateService.instant('DICE'));
  public possibleScores: number[] = [];

  //Dice
  private dice: Die[] = [];
  public diceHit: boolean = false;

  //Players
  public players: Player[] = [];
  public clientPlayer: Partial<Player> = {};
  public lastPlayer: Player = this.players.slice(-1)[0];
  private currentPlayer: Player = new Player('', '', false, new ScoreBoard(this.diceService, this.scoreService, this.translateService, this.modalService));
  private chosenMaxPlayers: number = 0;
  private connectedPlayersCounter: number = 0;

  //Misc
  private soundState?: boolean
  public animationState: boolean = false;
  private turnAudio = new Audio('https://zylion.se/yourturn.mp3')

  //Subscriptions
  private getDice$: Subscription = new Subscription;
  private getPlayers$: Subscription = new Subscription;
  private getCurrentPlayerResult: Subscription = new Subscription;
  private getEndOfGame$: Subscription = new Subscription;
  private getChosenMaxPlayers$: Subscription = new Subscription;
  private disconnectedPlayer$: Subscription = new Subscription;
  private langChange$: Subscription = new Subscription;
  private soundChange$: Subscription = new Subscription;
  private subscriptions: Subscription[] = [this.getChosenMaxPlayers$, this.langChange$, this.getDice$, this.getPlayers$, this.getCurrentPlayerResult, this.getEndOfGame$, this.disconnectedPlayer$, this.soundChange$]

  @ViewChild('results', {read: TemplateRef}) results!: TemplateRef<any>;

  constructor(
    private socketService: SocketService, 
    private diceService: DiceService, 
    private scoreService: ScoreService, 
    private playerService: PlayerService, 
    private modalService: NgbModal,
    private translateService: TranslateService,
    private clientService: ClientService,
    private _router: Router
  ) { }


  /**
   * Loading in the audio.
   * Retrieves the client player and stores it in @param this.clientPlayer
   * Subscribes to multiple observables in order to recieve updates.
   * @date 2023-01-31 - 12:54:05
   * @author Christopher Reineborn
   */
  async ngOnInit(): Promise<void> {
    this.turnAudio.load();
    this.clientPlayer = this.playerService.getClientPlayer();

    //Retrieves user's chosen max player
    this.chosenMaxPlayers = await firstValueFrom(this.playerService.getChosenMaxPlayers());

    //Subscribes to language change
    this.langChange$ = this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateService.stream('DICE').subscribe(translation => {
        const scoreRowNames: string[] = Object.keys(translation);
        for(let i = 0; i < this.scoreBoardHeaders.length; i++){
          this.scoreBoardHeaders[i] = translation[scoreRowNames[i]]
        }
      })
    })

    //Subscribes to sound state change
    this.soundChange$ = this.clientService.getSound().subscribe(sound => {
      this.soundState = sound;
    })

    //Subscribes to dice update
    this.getDice$ = this.diceService.getDice().subscribe(dice => {
      this.dice = dice;
      this.possibleScores = this.currentPlayer.score.possibleScore(this.scoreBoardHeaders, this.dice);
      this.diceHit = true;
    });

    //Subscribes to user's chosen max players.
    this.getChosenMaxPlayers$ = this.playerService.getChosenMaxPlayers().subscribe(async maxPlayers => {
      //If singleplayer
      if(maxPlayers === 1){
        this.players.push(this.playerService.getClientPlayer());
      }
      //If multiplayer
      if(maxPlayers > 1){
        await firstValueFrom(this.socketService.getPlayers()).then((players: any) => {
          players.map((player: any) => {
            this.players.push(new Player(player.name, player.sid, false, new ScoreBoard(this.diceService, this.scoreService, this.translateService, this.modalService)));
          });
        })
      }
      this.lastPlayer = this.players.slice(-1)[0];
      console.log(this.players);
      this.setNextPlayer();
    })

    //Subscribes to current player result from backend
    this.getCurrentPlayerResult = this.socketService.getCurrentPlayerResult().subscribe((previousPlayerResult: any) => {
      this.setScore(previousPlayerResult.scoreRowName, previousPlayerResult.dice);
    })

    //End game subscription
    this.getEndOfGame$ = this.scoreService.getEndOfGame().subscribe(bool => {
      this.players.sort((a:Player, b:Player) => b.score.total.score - a.score.total.score)
      bool ? this.modalService.open(this.results, {centered: true, animation: true, keyboard: true}) : null;
    })

    ////Subscribes to disconnected players from backend
    this.disconnectedPlayer$ = this.socketService.getDisconnectedPlayer().subscribe(socketID => {
      let disconnectedPlayer = this.players.findIndex(player => player.socketId === socketID);
      console.log(disconnectedPlayer);
      
      if(disconnectedPlayer !== -1){
        if(this.connectedPlayersCounter === disconnectedPlayer){
          this.diceService.setReset(true);
        }
        else if(this.connectedPlayersCounter > disconnectedPlayer){
          this.connectedPlayersCounter--;
        }
        this.players.splice(disconnectedPlayer, 1);
        this.lastPlayer = this.players.slice(-1)[0];
        this.setNextPlayer();
      }
    })
  }

   /**
    * Unsubscribes from all the observables.
    * @date 2023-01-31 - 13:03:35
    * @author Christopher Reineborn
    *
    * @returns {*}
    */
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    })
  }

  /**
   * Sets the score of the current player.
   * Checks if the function was triggered from the socketService by controlling if @param {?Die[]} [dice] was provided or not.
   * If not provided, sets the chosen score for @param this.currentPlayer based upon @param this.dice, proceeds to set the next player and emits the chosen score for the @param this.currentPlayer to the other sockets in the room.
   * If provided, sets the chosen score for @param this.currentPlayer based upon @param {?Die[]} [dice] and proceeds to set the next player.
   * 
   * @date 2023-01-31 - 13:09:43
   * @author Christopher Reineborn
   * 
   * @public
   * @param {string} scoreRowName - The scorerow to set the score to.
   * @param {?Die[]} [dice] - Optional and used if retrieved from the backend. Else @param this.dice is used.
   */
  public async setScore(scoreRowName: string, dice?: Die[]): Promise<void> {
    if(!dice){
      await this.currentPlayer.score.setScore(scoreRowName, this.dice, this.currentPlayer.socketId, this.clientPlayer.socketId!).then(async () => {
        await this.preparationForNextPlayer();
        this.setNextPlayer();
      });
      this.socketService.nextPlayer(scoreRowName, this.dice);
    }
    else {
      await this.currentPlayer.score.setScore(scoreRowName, dice, this.currentPlayer.socketId, this.clientPlayer.socketId!).then(async () => {
        await this.preparationForNextPlayer();
        this.setNextPlayer();
      });
    }
  }

  private async preparationForNextPlayer(): Promise<void> {
    this.lastPlayer.score.checkEndOfGame();
    this.connectedPlayersCounter < this.players.length-1 ? this.connectedPlayersCounter++ : this.connectedPlayersCounter = 0;
    this.possibleScores = [];
  }

  /**
   * Checks if the game is over by calling @function checkEndOfGame() of the last player.
   * Checks if the @param this.connectedPlayersCounter is less than the amount of players in @param this.players. If true, increments the counter. If false, resets the counter
   * Resets the possibleScores array
   * Sets the next player by using @param this.connectedPlayersCounter and assigns the new current player to the player service.
   * If the client player is the current player and it is a multiplayer game, uses the yourTurn animation.
   * @date 2023-01-31 - 13:14:02
   * @author Christopher Reineborn
   *
   * @private
   */
  private setNextPlayer(): void {
    console.log(this.currentPlayer)
    this.currentPlayer.currentPlayer = false;
    this.currentPlayer = this.players[this.connectedPlayersCounter];
    console.log(this.currentPlayer)
    this.currentPlayer.currentPlayer = true;
    this.diceHit = false;
    this.playerService.setCurrentPlayer(this.currentPlayer);

    this.currentPlayer.socketId === this.clientPlayer.socketId && this.chosenMaxPlayers > 1 ? this.animationYourTurn() : null
  }
  
  /**
   * Closes the final score modal, resets the player array, resets chosenMaxPlayers, resets clientPlayer and redirects the user to the landing page.
   * @date 2023-01-31 - 13:16:39
   * @author Christopher Reineborn
   * 
   * @public
   */
  public closeModalAndReset(): void {
    this.modalService.dismissAll()
    this.diceService.setNewTurn(true);
    this.playerService.setChosenMaxPlayers(0);
    this.playerService.setClientPlayer(new Player("", "", false, new ScoreBoard(this.diceService, this.scoreService, this.translateService, this.modalService)))
    this.players = [];
    this._router.navigate([''], {skipLocationChange: true});
  }

  
  /**
   * Trigger the yourTurn animation and plays the associated audio if sound is not muted.
   * @date 2/15/2023 - 10:19:33 AM
   *
   * @private
   */
  private animationYourTurn() {
    setTimeout(()=>{
      this.animationState = !this.animationState;
    },1)

    this.soundState === true ? this.turnAudio.play() : null;

    setTimeout(()=>{
      this.animationState = !this.animationState;
    },1001)
  }
}
 