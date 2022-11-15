import { Component, OnInit } from '@angular/core';
import { Die } from 'src/app/models/die';
import { ScoreRow } from 'src/app/models/score-row';
import { DiceService } from 'src/app/services/dice.service';


@Component({
  selector: 'app-scoreBoard',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.css']
})
export class ScoreBoardComponent implements OnInit {
  public aces = new ScoreRow('Aces', 0, true)
  public twos = new ScoreRow('Twos', 0, true)
  public threes = new ScoreRow('Threes', 0, true)
  public fours = new ScoreRow('Fours', 0, true)
  public fives = new ScoreRow('Fives', 0, true)
  public sixes = new ScoreRow('Sixes', 0, true)
  public bonus = new ScoreRow('Bonus', 0, false)
  public onePair = new ScoreRow('One Pair', 0, true)
  public twoPair = new ScoreRow('Two Pair', 0, true)
  public threeOfAKind = new ScoreRow('Three of a kind', 0, true)
  public fourOfAKind = new ScoreRow('Four of a kind', 0, true)
  public smallStraight = new ScoreRow('Small straight', 0, true)
  public largeStraight = new ScoreRow('Large straight', 0, true)
  public chance = new ScoreRow('Chance', 0, true)
  public yatzy = new ScoreRow('Yatzy', 0, true)
  public total = new ScoreRow('Total', 0, false)

  public scoreBoard = [this.aces, this.twos, this.threes, this.fours, this.fives, this.sixes, this.bonus, this.onePair, this.twoPair, this.threeOfAKind, this.fourOfAKind, this.smallStraight, this.largeStraight, this.chance, this.yatzy, this.total]
  
  public dice: Die[] = [];

  // public scoreBoard: ScoreBoard = {
  //   aces: {name: 'Aces', score: 0, selectable: true},
  //   twos: {name: 'Twos', score: 0, selectable: true},
  //   threes: {name: 'Threes', score: 0, selectable: true},
  //   fours: {name: 'Fours', score: 0, selectable: true},
  //   fives: {name: 'Fives', score: 0, selectable: true},
  //   sixes: {name: 'Sixes', score: 0, selectable: true},
  //   bonus: {name: 'Bonus', score: 0, selectable: false}, 
  //   onePair: {name: 'One pair', score: 0, selectable: true},
  //   twoPair: {name: 'Two pair', score: 0, selectable: true},
  //   threeOfAKind: {name: 'Three of a kind', score: 0, selectable: true},
  //   fourOfAKind: {name: 'Four of a kind', score: 0, selectable: true},
  //   smallStraight: {name: 'Small straight', score: 0, selectable: true},
  //   largeStraight: {name: 'Large straight', score: 0, selectable: true},
  //   chance: {name: 'Chance', score: 0, selectable: true},
  //   yatzy: {name: 'Yatzy', score: 0, selectable: true},
  //   total: 0
  // };

  constructor(private diceService: DiceService) { }

  ngOnInit(): void {
    this.diceService.getDice().subscribe(dice => {
      this.dice = dice;
    })
  }

  public setScore(name: string): void {
    if(name == 'Aces'){
      for(let die of this.dice){
        this.aces.score += die.side;
        this.aces.selectable = false;
      }
    }
    this.diceService.setReset(true);
  }

}
