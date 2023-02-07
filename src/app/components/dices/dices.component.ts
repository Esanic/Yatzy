import { rotateAnimation } from 'src/app/animations/rotate.animation';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { Die } from 'src/app/models/die';
import { Player } from 'src/app/models/player';
import { DiceService } from 'src/app/services/dice.service';
import { PlayerService } from 'src/app/services/player.service';
import { SocketService } from 'src/app/services/socket.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-dices',
  templateUrl: './dices.component.html',
  styleUrls: ['./dices.component.css'],
  animations: [rotateAnimation(1080, 300)]
})

export class DicesComponent implements OnInit, OnDestroy {
  public animationState: boolean = true;
  private diceAudio = new Audio('../../../assets/sounds/rollingdice.mp3')
  
  public clientPlayer: Partial<Player> = {};
  public currentPlayer: Partial<Player> = {};
  public chosenMaxPlayer: number = 0;
  
  public dieOne = new Die(1, 1, false);
  public dieTwo = new Die(2, 1, false);
  public dieThree = new Die(3, 1, false);
  public dieFour = new Die(4, 1, false);
  public dieFive = new Die(5, 1, false);

  public availableDice: Die[] = [this.dieOne, this.dieTwo, this.dieThree, this.dieFour, this.dieFive];

  public currentHits: number = 0;
  public diceAvailable: boolean = true;
  public disablePlayButton: boolean = false;

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
  async ngOnInit(): Promise<void> {
    this.diceAudio.load();
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
      this.animate();
      this.diceAudio.play();
      this.availableDice.map((die, index) => {
        die.die = dice[index].die,
        die.selected = dice[index].selected,
        die.side = dice[index].side
      })
    })

    this.subDiceMovement$ = this.socketService.getDiceMovement().subscribe((dice: any) => {
      this.availableDice = [...dice];
    })

    this.chosenMaxPlayer = await firstValueFrom(this.playerService.getChosenMaxPlayers());
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
        this.socketService.diceMoving(this.availableDice);
        break;
      case 1:
        this.dieTwo.selected === false ? this.dieTwo.selected = true : this.dieTwo.selected = false;
        this.socketService.diceMoving(this.availableDice);
        break;
      case 2:
        this.dieThree.selected === false ? this.dieThree.selected = true : this.dieThree.selected = false;
        this.socketService.diceMoving(this.availableDice);
        break;
      case 3:
        this.dieFour.selected === false ? this.dieFour.selected = true : this.dieFour.selected = false;
        this.socketService.diceMoving(this.availableDice);
        break;
      case 4:
        this.dieFive.selected === false ? this.dieFive.selected = true : this.dieFive.selected = false;
        this.socketService.diceMoving(this.availableDice);
        break;
    }
  }

  /**
   * Generates new values for each of the dice in the array of available dice, if the value is anything else than -1.
   * Controls what the current hits counter is and enables/disables the play button upon that control.
   * Makes the dice available to be moved and sends the dice to both backend and dice service.
   * @date 2023-01-31 - 12:19:43
   * @author Christopher Reineborn
   * 
   * @public
   */
  public hitDices(): void {
    this.animate();
    this.diceAudio.play();
    this.availableDice.map(die => die.side != -1 && die.selected === false ? die.side = Math.floor(Math.random() * 6) + 1 : null)
    this.currentHits += 1;
    this.currentHits >= 3 ? this.disablePlayButton = true : this.disablePlayButton = false;
    this.diceAvailable = false;
    this.diceService.setDice(this.availableDice);
    this.socketService.diceHit(this.availableDice);
  }

  /**
   * Resets all dice, resets all the arrays, resets the hit counter, makes the dice unavailable and disables the play button.
   * If single-player, also sends the resetted dice into dice service.
   * @date 2023-01-31 - 12:30:25
   * @author Christopher Reineborn
   *
   * @private
   */
  private newTurn(): void {
    this.resetDices();
    this.diceAvailable = true;
    this.disablePlayButton = false;
    
    this.chosenMaxPlayer === 1 ? this.diceService.setDice(this.availableDice) : null;
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
    this.availableDice = [this.dieOne, this.dieTwo, this.dieThree, this.dieFour, this.dieFive];
    this.currentHits = 0;
  }

  private animate() {
    setTimeout(()=>{
      this.animationState = !this.animationState;
    },1)
  }
}
