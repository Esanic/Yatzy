import { rotateAnimation } from 'src/app/animations/rotate.animation';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { Die } from 'src/app/models/die';
import { Player } from 'src/app/models/player';
import { DiceService } from 'src/app/services/dice.service';
import { PlayerService } from 'src/app/services/player.service';
import { SocketService } from 'src/app/services/socket.service';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-dices',
  templateUrl: './dices.component.html',
  styleUrls: ['./dices.component.css'],
  animations: [rotateAnimation(3, 300)]
})

export class DicesComponent implements OnInit, OnDestroy {
  //Dice
  public dieOne = new Die(1, 0, false);
  public dieTwo = new Die(2, 0, false);
  public dieThree = new Die(3, 0, false);
  public dieFour = new Die(4, 0, false);
  public dieFive = new Die(5, 0, false);
  public dice: Die[] = [this.dieOne, this.dieTwo, this.dieThree, this.dieFour, this.dieFive];
  public currentHits: number = 0;
  public isDiceAvailable: boolean = true;

  //Player
  public clientPlayer: Partial<Player> = {};
  public currentPlayer: Partial<Player> = {};
  public chosenMaxPlayer: number = 0;
  
  public disablePlayButton: boolean = false;

  //Misc
  private soundState?: boolean;
  public animationState: boolean = true;
  private diceAudio = new Audio('https://zylion.se/rollingdice.mp3')

  //Subscriptions
  private newTurn$: Subscription = new Subscription;
  private resetDice$: Subscription = new Subscription;
  private currentPlayer$: Subscription = new Subscription;
  private getClientPlayer$: Subscription = new Subscription;
  private diceHit$: Subscription = new Subscription;
  private diceMovement$: Subscription = new Subscription;
  private soundChange$: Subscription = new Subscription;
  private subscriptions: Subscription[] = [this.getClientPlayer$, this.newTurn$, this.resetDice$, this.currentPlayer$, this.diceHit$, this.diceMovement$, this.soundChange$];

  constructor(
    private diceService: DiceService, 
    private playerService: PlayerService,
    private socketService: SocketService,
    private clientService: ClientService
  ) { }

  /**
   * Retrieves the client player and stores it in @param this.clientPlayer
   * Subscribes to multiple observables in order to recieve updates.
   * @date 2023-01-31 - 12:00:49
   * @author Christopher Reineborn
   */
  async ngOnInit(): Promise<void> {
    this.diceAudio.load();
    // this.clientPlayer = this.playerService.getClientPlayer();
    this.getClientPlayer$ = this.playerService.getClientPlayer().subscribe(player => {
      this.clientPlayer = player;
    });

    //Retrieves user's chosen max player
    this.chosenMaxPlayer = await firstValueFrom(this.playerService.getChosenMaxPlayers());

    //Subscribes to sound state change
    this.soundChange$ = this.clientService.getSound().subscribe(sound => {
      this.soundState = sound;
    })

    //Subscribes to new turn
    this.newTurn$ = this.diceService.getNewTurn().subscribe(bool => {
      if(bool) {
        this.newTurn();
        this.diceService.setNewTurn(false);
      }
    })

    //Subscribes to reset dice
    this.resetDice$ = this.diceService.getReset().subscribe(bool =>{
      if(bool){
        this.resetDices();
        this.diceService.setReset(false);
      }
    })

    //Subscribes to Current Player
    this.currentPlayer$ = this.playerService.getCurrentPlayer().subscribe(player => {
      this.currentPlayer = player;
      this.currentPlayer.socketId === this.clientPlayer.socketId ? this.disablePlayButton = false : this.disablePlayButton = true;
    })

    //Subscribes to dice hit from backend
    this.diceHit$ = this.socketService.getDiceHit().subscribe(dice => {
      this.animateDiceRoll();
      this.soundState === true ? this.diceAudio.play() : null;
      this.dice.map((die, index) => {
        die.die = dice[index].die,
        die.selected = dice[index].selected,
        die.side = dice[index].side
      })
    })

    //Subscribes to dice movement from backend
    this.diceMovement$ = this.socketService.getDiceMovement().subscribe((dice: any) => {
      this.dice = [...dice];
    })
  }

  /**
   * Unsubscribes from all observables.
   * @date 2023-01-31 - 12:10:41
   * @author Christopher Reineborn
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    })
  }

  /**
   * Decides what die to send to @function moveDicesToSaved()
   * @date 2023-01-31 - 12:11:07
   * @author Christopher Reineborn
   *
   * @public
   * @param {number} die - which die to send.
   */
  public selectDie(die: number): void {
    switch(die){
      case 0:
        this.dieOne.selected === false ? this.dieOne.selected = true : this.dieOne.selected = false;
        this.socketService.diceMoving(this.dice);
        break;
      case 1:
        this.dieTwo.selected === false ? this.dieTwo.selected = true : this.dieTwo.selected = false;
        this.socketService.diceMoving(this.dice);
        break;
      case 2:
        this.dieThree.selected === false ? this.dieThree.selected = true : this.dieThree.selected = false;
        this.socketService.diceMoving(this.dice);
        break;
      case 3:
        this.dieFour.selected === false ? this.dieFour.selected = true : this.dieFour.selected = false;
        this.socketService.diceMoving(this.dice);
        break;
      case 4:
        this.dieFive.selected === false ? this.dieFive.selected = true : this.dieFive.selected = false;
        this.socketService.diceMoving(this.dice);
        break;
    }
  }

  /**
   * Animate dice rolling and play dice rolling sound if sound is not muted.
   * Generates new values for each of the dice in the array of available dice, if the value is anything else than -1.
   * Controls what the current hits counter is and enables/disables the play button upon that control.
   * Makes the dice available to be moved and sends the dice to both backend and dice service.
   * @date 2023-01-31 - 12:19:43
   * @author Christopher Reineborn
   * 
   * @public
   */
  public hitDices(): void {
    this.animateDiceRoll();
    this.soundState === true ? this.diceAudio.play() : null;

    this.dice.map(die => die.side != -1 && die.selected === false ? die.side = Math.floor(Math.random() * 6) + 1 : null)
    
    this.currentHits += 1;
    this.currentHits >= 3 ? this.disablePlayButton = true : this.disablePlayButton = false;
    this.isDiceAvailable = false;
    
    this.diceService.setDice(this.dice);
    this.socketService.diceHit(this.dice);
  }

  /**
   * Resets all dice, resets all the arrays, resets the hit counter, makes the dice unavailable and disables the play button.
   * If singleplayer, also sends the resetted dice into dice service.
   * @date 2023-01-31 - 12:30:25
   * @author Christopher Reineborn
   *
   * @private
   */
  private newTurn(): void {
    this.resetDices();
    this.isDiceAvailable = true;
    this.disablePlayButton = false;
    this.chosenMaxPlayer === 1 ? this.diceService.setDice(this.dice) : null;
  }
  
  /**
   * Resets all dice, resets all arrays and resets the hit counter.
   * @date 2023-02-02 - 15:26:17
   * @author Christopher Reineborn
   *
   * @private
   */
  private resetDices(): void {
    this.dieOne = new Die(1, 0, false);
    this.dieTwo = new Die(2, 0, false);
    this.dieThree = new Die(3, 0, false);
    this.dieFour = new Die(4, 0, false);
    this.dieFive = new Die(5, 0, false);
    this.dice = [this.dieOne, this.dieTwo, this.dieThree, this.dieFour, this.dieFive];
    this.currentHits = 0;
  }

  
  /**
   * Animate dice rolling
   * @date 2/15/2023 - 11:13:24 AM
   *
   * @private
   */
  private animateDiceRoll() {
    setTimeout(()=>{
      this.animationState = !this.animationState;
    },1)
  }
}
