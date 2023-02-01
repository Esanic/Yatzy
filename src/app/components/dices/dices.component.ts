import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Die } from 'src/app/models/die';
import { Player } from 'src/app/models/player';
import { DiceService } from 'src/app/services/dice.service';
import { PlayerService } from 'src/app/services/player.service';
import { SocketService } from 'src/app/services/socket.service';


@Component({
  selector: 'app-dices',
  templateUrl: './dices.component.html',
  styleUrls: ['./dices.component.css']
})

export class DicesComponent implements OnInit, OnDestroy {
  public clientPlayer: Partial<Player> = {};
  public currentPlayer: Partial<Player> = {};

  public dieOne = new Die(1, 1, false);
  public dieTwo = new Die(2, 1, false);
  public dieThree = new Die(3, 1, false);
  public dieFour = new Die(4, 1, false);
  public dieFive = new Die(5, 1, false);
  public diePlaceholder = new Die(0, 0, false);

  public availableDice: Die[] = [this.dieOne, this.dieTwo, this.dieThree, this.dieFour, this.dieFive];
  public savedDice: Die[] = [this.diePlaceholder, this.diePlaceholder, this.diePlaceholder, this.diePlaceholder, this.diePlaceholder];
  private finalDice: Die[] = [...this.availableDice]

  public currentHits: number = 0;
  public diceAvailable: boolean = true;
  public disablePlayButton: boolean = true;

  private subNewTurn$: Subscription = new Subscription;
  private subResetDice$: Subscription = new Subscription;
  private subCurrentPlayer$: Subscription = new Subscription;
  private subDiceHit$: Subscription = new Subscription;
  private subDiceMovement$: Subscription = new Subscription;
  private subscriptions: Subscription[] = [this.subNewTurn$, this.subResetDice$, this.subCurrentPlayer$, this.subDiceHit$, this.subDiceMovement$];

  constructor(
    private diceService: DiceService, 
    private playerService: PlayerService,
    private socketService: SocketService
  ) { }

  /**
   * Retrieves the client player and stores it in @param this.clientPlayer
   * Subscribes to multiple observables in order to recieve updates.
   * @date 2023-01-31 - 12:00:49
   * @author Christopher Reineborn
   */
  ngOnInit(): void {
    this.clientPlayer = this.playerService.getClientPlayer();

    this.subNewTurn$ = this.diceService.getNewTurn().subscribe(bool => {
      if(bool) {
        this.newTurn();
        this.diceService.setNewTurn(false);
      }
    })

    this.subResetDice$ = this.diceService.getReset().subscribe(bool =>{
      if(bool){
        this.resetDices();
        this.diceService.setReset(false);
      }
    })

    this.subCurrentPlayer$ = this.playerService.getCurrentPlayer().subscribe(player => {
      this.currentPlayer = player;
      this.currentPlayer.socketId === this.clientPlayer.socketId ? this.disablePlayButton = false : this.disablePlayButton = true;
    })

    this.subDiceHit$ = this.socketService.getDiceHit().subscribe(dice => {
      this.availableDice.map((die, index) => {
        die.die = dice[index].die,
        die.selected = dice[index].selected,
        die.side = dice[index].side
      })
    })

    this.subDiceMovement$ = this.socketService.getDiceMovement().subscribe((objWithArrs: any) => {
      this.availableDice.map((die, index) => {
        die.die = objWithArrs.availableDice[index].die;
        die.selected = objWithArrs.availableDice[index].selected;
        die.side = objWithArrs.availableDice[index].side;
      })
      this.savedDice = [...objWithArrs.savedDice];
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
   * Decides what die to send to the next function
   * @date 2023-01-31 - 12:11:07
   * @author Christopher Reineborn
   *
   * @public
   * @param {number} die - which die to send into the next function.
   */
  public pickDie(die: number): void {
    switch(die){
      case 0:
        this.moveDicesToSaved(this.dieOne);
        break;
      case 1:
        this.moveDicesToSaved(this.dieTwo);
        break;
      case 2:
        this.moveDicesToSaved(this.dieThree);
        break;
      case 3:
        this.moveDicesToSaved(this.dieFour);
        break;
      case 4:
        this.moveDicesToSaved(this.dieFive);
        break;
    }
  }

  /**
   * Decides what die to send to the next function
   * @date 2023-01-31 - 12:13:57
   * @author Christopher Reineborn
   *
   * @public
   * @param {number} die - which die to send into the next function.
   */
  public removeDie(die: number): void {
    switch(die){
      case 0:
        this.moveDicesToAvailable(this.dieOne);
        break;
      case 1:
        this.moveDicesToAvailable(this.dieTwo);
        break;
      case 2:
        this.moveDicesToAvailable(this.dieThree);
        break;
      case 3:
        this.moveDicesToAvailable(this.dieFour);
        break;
      case 4:
        this.moveDicesToAvailable(this.dieFive);
        break;
    }
  }
  
  /**
   * Moves the incoming die from the array of available dice to the array of saved dice.
   * @date 2023-01-31 - 12:15:50
   * @author Christopher Reineborn
   *
   * @private
   * @param {Die} die
   */
  private moveDicesToSaved(die: Die): void {
    die.selected = true;
    this.savedDice.splice(die.die-1, 1, die);
    this.availableDice.splice(die.die-1, 1, this.diePlaceholder);
    this.socketService.diceMoving(this.availableDice, this.savedDice);
  }

  
  /**
   * Moves the incoming die from the array of saved dice to the array of available dice.
   * @date 2023-01-31 - 12:19:08
   * @author Christopher Reineborn
   *
   * @private
   * @param {Die} die
   */
  private moveDicesToAvailable(die: Die): void {
    die.selected = false;
    this.availableDice.splice(die.die-1, 1, die);
    this.savedDice.splice(die.die-1, 1, this.diePlaceholder);
    this.socketService.diceMoving(this.availableDice, this.savedDice);
  }

  
  /**
   * Generates new values for each of the dice in the array of available dice, if the value is anything else than 0.
   * Controls what the current hits counter is and enables/disables the play button upon that control.
   * Makes the dice available to be moved and sends the dice to both backend and dice service.
   * @date 2023-01-31 - 12:19:43
   * @author Christopher Reineborn
   * 
   * @public
   */
  public hitDices(): void {
    this.availableDice.map(die => die.side != 0 ? die.side = Math.floor(Math.random() * 6) + 1 : null)
    this.currentHits += 1;
    this.currentHits >= 3 ? this.disablePlayButton = true : this.disablePlayButton = false;
    this.diceAvailable = false;
    this.diceService.setDice(this.finalDice);
    this.socketService.diceHit(this.availableDice);
  }

  
  
  /**
   * Resets all the dice, resets all the arrays, resets the hit counter, makes the dice unavailable and disables the play button.
   * @date 2023-01-31 - 12:30:25
   * @author Christopher Reineborn
   *
   * @private
   */
  private newTurn(): void {
    this.dieOne = new Die(1, 1, false);
    this.dieTwo = new Die(2, 1, false);
    this.dieThree = new Die(3, 1, false);
    this.dieFour = new Die(4, 1, false);
    this.dieFive = new Die(5, 1, false);
    this.savedDice = [this.diePlaceholder, this.diePlaceholder, this.diePlaceholder, this.diePlaceholder, this.diePlaceholder];
    this.availableDice = [this.dieOne, this.dieTwo, this.dieThree, this.dieFour, this.dieFive];
    this.finalDice = [...this.availableDice];
    this.currentHits = 0;
    this.diceAvailable = true;
    this.disablePlayButton = false;
  }

  private resetDices(): void {
    this.dieOne = new Die(1, 1, false);
    this.dieTwo = new Die(2, 1, false);
    this.dieThree = new Die(3, 1, false);
    this.dieFour = new Die(4, 1, false);
    this.dieFive = new Die(5, 1, false);
    this.savedDice = [this.diePlaceholder, this.diePlaceholder, this.diePlaceholder, this.diePlaceholder, this.diePlaceholder];
    this.availableDice = [this.dieOne, this.dieTwo, this.dieThree, this.dieFour, this.dieFive];
    this.finalDice = [...this.availableDice];
    this.currentHits = 0;
  }

}
