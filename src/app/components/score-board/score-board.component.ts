import { Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DefaultLangChangeEvent, LangChangeEvent, TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { Subscription, pipe, take } from 'rxjs';
import { yourTurnAnimation } from 'src/app/animations/yourturn.animation';
import { Die } from 'src/app/models/die';
import { Player } from 'src/app/models/player';
import { ScoreBoard } from 'src/app/models/score-board';
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
  public animationState: boolean = false;
  private turnAudio = new Audio('https://zylion.se/yourturn.mp3')

  public scoreBoardHeaders = Object.values(this.translateService.instant('DICE'))

  public players: Player[] = [];
  public clientPlayer: Partial<Player> = {};
  public lastPlayer: Player = this.players.slice(-1)[0];
  private currentPlayer: Player = new Player('', '', false, new ScoreBoard(this.diceService, this.scoreService, this.translateService));
  private chosenMaxPlayers: number = 0;

  private dice: Die[] = [];

  public possibleScores: number[] = []

  private currentPlayerCounter: number = 0;
  public diceHit: boolean = false;

  private subGetDice$: Subscription = new Subscription;
  private subGetPlayers$: Subscription = new Subscription;
  private subGetNextPlayer$: Subscription = new Subscription;
  private subGetEndOfGame$: Subscription = new Subscription;
  private subDisconnectedPlayer$: Subscription = new Subscription;
  private subLangChange$: Subscription = new Subscription;
  private subscriptions: Subscription[] = [this.subLangChange$, this.subGetDice$, this.subGetPlayers$, this.subGetNextPlayer$, this.subGetEndOfGame$, this.subDisconnectedPlayer$]

  @ViewChild('content', {read: TemplateRef}) content!: TemplateRef<any>;

  constructor(
    private socketService: SocketService, 
    private diceService: DiceService, 
    private scoreService: ScoreService, 
    private playerService: PlayerService, 
    private modalService: NgbModal,
    private translateService: TranslateService,
    private _router: Router
  ) { }


  /**
   * Retrieves the client player and stores it in @param this.clientPlayer
   * Subscribes to multiple observables in order to recieve updates.
   * @date 2023-01-31 - 12:54:05
   * @author Christopher Reineborn
   */
  ngOnInit(): void {
    this.turnAudio.load();
    this.clientPlayer = this.playerService.getClientPlayer();

    this.subLangChange$ = this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateService.stream('DICE').subscribe(translation => {
        const scoreRowNames: string[] = Object.keys(translation);
        for(let i = 0; i < this.scoreBoardHeaders.length; i++){
          this.scoreBoardHeaders[i] = translation[scoreRowNames[i]]
        }
      })
    })

    this.subGetDice$ = this.diceService.getDice().subscribe(dice => {
      this.dice = dice;
      this.possibleScores = this.currentPlayer.score.possibleScore(this.scoreBoardHeaders, this.dice);
      this.diceHit = true;
    });

    this.playerService.getChosenMaxPlayers().subscribe(maxPlayers => {
      if(maxPlayers === 1){
        this.players.push(this.playerService.getClientPlayer());
        this.lastPlayer = this.players.slice(-1)[0];
        this.setCurrentPlayer();
      }
      if(maxPlayers > 1){
        this.subGetPlayers$ = this.socketService.getPlayers().subscribe((players: any) => {
          players.map((player: any) => {
            this.players.push(new Player(player.name, player.sid, false, new ScoreBoard(this.diceService, this.scoreService, this.translateService)));
          });
          this.lastPlayer = this.players.slice(-1)[0];
          this.setCurrentPlayer();
        });
      }
    })

    this.subGetNextPlayer$ = this.socketService.getNextPlayer().subscribe((obj: any) => {
      this.setScore(obj.scoreRowName, obj.dice);
    })

    this.subGetEndOfGame$ = this.scoreService.getEndOfGame().subscribe(bool => {
      this.players.sort((a:Player, b:Player) => b.score.total.score - a.score.total.score)
      bool ? this.modalService.open(this.content, {centered: true, animation: true, keyboard: true}) : null;
    })

    this.subDisconnectedPlayer$ = this.socketService.getDisconnectedPlayer().subscribe(socketID => {
      let disconnectedPlayer = this.players.findIndex(player => player.socketId === socketID);
      
      if(disconnectedPlayer !== -1){
        if(this.currentPlayerCounter === disconnectedPlayer){
          this.diceService.setReset(true);
        }
        else if(this.currentPlayerCounter > disconnectedPlayer){
          this.currentPlayerCounter--;
        }
        this.players.splice(disconnectedPlayer, 1);
        this.lastPlayer = this.players.slice(-1)[0];
        this.setCurrentPlayer();
      }
    })

    this.playerService.getChosenMaxPlayers().pipe(take(1)).subscribe(maxPlayers => {
      this.chosenMaxPlayers = maxPlayers;
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
   * Sets the score of the player.
   * Checks the last player if they have a full scoreboard.
   * Controls if the current player counter is bigger than the amount of players, if not it increments the counter else it sets it to 0.
   * Proceeds to set the next player.
   * @date 2023-01-31 - 13:09:43
   * @author Christopher Reineborn
   * 
   * @public
   * @param {string} scoreRowName - The scorerow to set the score to.
   * @param {?Die[]} [dice] - Optional and used if retrieved from the backend else @param this.dice is used.
   */
  public setScore(scoreRowName: string, dice?: Die[]): void{
    if(dice){
      this.currentPlayer.score.setScore(scoreRowName, dice);
    }
    else {
      this.currentPlayer.score.setScore(scoreRowName, this.dice);
      this.socketService.nextPlayer(scoreRowName, this.dice);
    }

    this.lastPlayer.score.checkEndOfGame();
    this.currentPlayerCounter < this.players.length-1 ? this.currentPlayerCounter++ : this.currentPlayerCounter = 0;
    this.possibleScores = [];
    this.setCurrentPlayer();
  }

  /**
   * Sets the next player by using the current player counter and assigns the new current player to the player service.
   * @date 2023-01-31 - 13:14:02
   * @author Christopher Reineborn
   *
   * @private
   */
  private setCurrentPlayer(): void {
    this.currentPlayer.currentPlayer = false;
    this.currentPlayer = this.players[this.currentPlayerCounter];
    this.currentPlayer.currentPlayer = true;
    this.diceHit = false;
    this.playerService.setCurrentPlayer(this.currentPlayer);

    if(this.currentPlayer.socketId === this.clientPlayer.socketId && this.chosenMaxPlayers > 1){
      this.animate();
    }
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
    this.playerService.setClientPlayer(new Player("", "", false, new ScoreBoard(this.diceService, this.scoreService, this.translateService)))
    this.players = [];
    this._router.navigate([''], {skipLocationChange: true});
  }

  private animate() {
    setTimeout(()=>{
      this.animationState = !this.animationState;

    },1)
    this.turnAudio.play();
    setTimeout(()=>{
      this.animationState = !this.animationState;
    },1001)
  }
}
 