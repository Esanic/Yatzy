import { Component, OnInit } from '@angular/core';
import { Die } from 'src/app/models/die';

@Component({
  selector: 'app-dices',
  templateUrl: './dices.component.html',
  styleUrls: ['./dices.component.css']
})
export class DicesComponent implements OnInit {
  public dieOne: Die = {die: 1, side: 1, selected: false};
  public dieTwo: Die = {die: 2, side: 2, selected: false};
  public dieThree: Die = {die: 3, side: 3, selected: false};
  public dieFour: Die = {die: 4, side: 4, selected: false};
  public dieFive: Die = {die: 5, side: 5, selected: false};
  public diePlaceholder: Die = {die: 0, side: 0, selected: false};
  
  public availableDices: Die[] = [this.dieOne, this.dieTwo, this.dieThree, this.dieFour, this.dieFive];
  public savedDices: Die[] = [this.diePlaceholder, this.diePlaceholder, this.diePlaceholder, this.diePlaceholder, this.diePlaceholder];

  public currentScore: number = 0;
  public currentHits = 0;

  public dicesAvailable: boolean = true;

  constructor() { }

  ngOnInit(): void {
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
  }

}
