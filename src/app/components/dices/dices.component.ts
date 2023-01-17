import { Component, OnInit } from '@angular/core';
import { Die } from 'src/app/models/die';
import { DiceService } from 'src/app/services/dice.service';
import { PlayerService } from 'src/app/services/player.service';
import { SocketService } from 'src/app/services/socket.service';


@Component({
  selector: 'app-dices',
  templateUrl: './dices.component.html',
  styleUrls: ['./dices.component.css']
})

export class DicesComponent implements OnInit {
  public clientPlayer: string = "";
  public currentPlayer: string = "";

  public dieOne = new Die(1, 1, false);
  public dieTwo = new Die(2, 1, false);
  public dieThree = new Die(3, 1, false);
  public dieFour = new Die(4, 1, false);
  public dieFive = new Die(5, 1, false);
  public diePlaceholder = new Die(0, 0, false);

  public availableDices: Die[] = [this.dieOne, this.dieTwo, this.dieThree, this.dieFour, this.dieFive];
  public savedDices: Die[] = [this.diePlaceholder, this.diePlaceholder, this.diePlaceholder, this.diePlaceholder, this.diePlaceholder];
  private finalDices: Die[] = [...this.availableDices]

  public currentScore: number = 0;
  public currentHits: number = 0;

  public dicesAvailable: boolean = true;

  public disableAdd: boolean = false;
  public disablePlayButton: boolean = true;

  constructor(private diceService: DiceService, private playerService: PlayerService, private socketService: SocketService) { }

  ngOnInit(): void {
    this.clientPlayer = this.playerService.getClientPlayer();

    this.diceService.getReset().subscribe(bool => {
      if(bool == true) {
        this.newTurn();
        this.diceService.setReset(false);
      }
    })

    this.playerService.getDisableAddPlayers().subscribe(bool => {
      this.disableAdd = bool;
    })

    this.playerService.getCurrentPlayer().subscribe(name => {
      this.currentPlayer = name;
      this.currentPlayer == this.clientPlayer ? this.disablePlayButton = false : this.disablePlayButton = true;
      // this.disablePlayButton = false;
    })

    this.socketService.getDiceHit().subscribe(dice => {
      console.log(dice);
      if(!(this.clientPlayer == this.currentPlayer)){
        this.availableDices = dice;
      }
    })
  }

  public pickDie(die: number, side: number): void {
    switch(die){
      case 0:
        this.moveDicesToSaved(this.dieOne, side);
        break;
      case 1:
        this.moveDicesToSaved(this.dieTwo, side);
        break;
      case 2:
        this.moveDicesToSaved(this.dieThree, side);
        break;
      case 3:
        this.moveDicesToSaved(this.dieFour, side);
        break;
      case 4:
        this.moveDicesToSaved(this.dieFive, side);
        break;
    }
  }

  public removeDie(die: number, side: number): void {
    switch(die){
      case 0:
        this.moveDicesToAvailable(this.dieOne, side);
        break;
      case 1:
        this.moveDicesToAvailable(this.dieTwo, side);
        break;
      case 2:
        this.moveDicesToAvailable(this.dieThree, side);
        break;
      case 3:
        this.moveDicesToAvailable(this.dieFour, side);
        break;
      case 4:
        this.moveDicesToAvailable(this.dieFive, side);
        break;
    }
  }

  private moveDicesToSaved(die: Die, side: number): void {
    die.selected = true;
    this.savedDices.splice(die.die-1, 1, die);
    this.availableDices.splice(die.die-1, 1, this.diePlaceholder);
    this.currentScore += side;
  }

  private moveDicesToAvailable(die: Die, side: number): void {
    die.selected = false;
    this.availableDices.splice(die.die-1, 1, die);
    this.savedDices.splice(die.die-1, 1, this.diePlaceholder);
    this.currentScore -= side;
  }

  public hitDices(): void {
    this.disableAdd == false ? this.playerService.setDisableAddPlayers(true) : this.disableAdd = true;
    this.availableDices.map(die => die.side != 0 ? die.side = Math.floor(Math.random() * 6) + 1 : null)
    console.log(this.availableDices);
    this.socketService.diceHit(this.availableDices);
    this.currentHits += 1;
    this.currentHits >= 3 ? this.disablePlayButton = true : this.disablePlayButton = false;
    this.dicesAvailable = false;
    this.diceService.setDice(this.finalDices);
  }

  private newTurn(): void {
    this.dieOne = new Die(1, 1, false);
    this.dieTwo = new Die(2, 1, false);
    this.dieThree = new Die(3, 1, false);
    this.dieFour = new Die(4, 1, false);
    this.dieFive = new Die(5, 1, false);
    this.savedDices = [this.diePlaceholder, this.diePlaceholder, this.diePlaceholder, this.diePlaceholder, this.diePlaceholder];
    this.availableDices = [this.dieOne, this.dieTwo, this.dieThree, this.dieFour, this.dieFive];
    this.finalDices = [...this.availableDices];
    this.currentHits = 0;
    this.dicesAvailable = true;
    this.currentScore = 0;
    this.disablePlayButton = false;

  }

}
