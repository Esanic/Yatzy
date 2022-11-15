import { Component, OnInit } from '@angular/core';
import { offset } from '@popperjs/core';
import { Die } from 'src/app/models/die';
import { DiceService } from 'src/app/services/dice.service';


@Component({
  selector: 'app-dices',
  templateUrl: './dices.component.html',
  styleUrls: ['./dices.component.css']
})

export class DicesComponent implements OnInit {
  public dieOne = new Die(1, 1, false);
  public dieTwo = new Die(2, 2, false);
  public dieThree = new Die(3, 3, false);
  public dieFour = new Die(4, 4, false);
  public dieFive = new Die(5, 5, false);
  public diePlaceholder = new Die(0, 0, false);

  public availableDices: Die[] = [this.dieOne, this.dieTwo, this.dieThree, this.dieFour, this.dieFive];
  public savedDices: Die[] = [this.diePlaceholder, this.diePlaceholder, this.diePlaceholder, this.diePlaceholder, this.diePlaceholder];
  private finalDices: Die[] = [...this.availableDices]

  public currentScore: number = 0;
  public currentHits: number = 0;

  public dicesAvailable: boolean = true;

  constructor(private diceService: DiceService) { }

  ngOnInit(): void {
    this.diceService.getReset().subscribe(bool => {
      if(bool == true) {
        this.newTurn();
        this.diceService.setReset(false);
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
    for(let i = 0; i < this.availableDices.length; i++){
      if(this.availableDices[i].side != 0){
        this.availableDices[i].side = Math.floor(Math.random() * 6)+1;
      }
    }
    this.currentHits += 1;
    this.dicesAvailable = false;
    this.diceService.setDice(this.finalDices);

  }

  private newTurn(): void {
    this.dieOne = {die: 1, side: 1, selected: false}
    this.dieTwo = {die: 2, side: 1, selected: false}
    this.dieThree = {die: 3, side: 1, selected: false}
    this.dieFour = {die: 4, side: 1, selected: false}
    this.dieFive = {die: 5, side: 1, selected: false}
    this.savedDices = [this.diePlaceholder, this.diePlaceholder, this.diePlaceholder, this.diePlaceholder, this.diePlaceholder];
    this.availableDices = [this.dieOne, this.dieTwo, this.dieThree, this.dieFour, this.dieFive];
    this.currentHits = 0;
    this.dicesAvailable = true;
    this.currentScore = 0;

  }

}
