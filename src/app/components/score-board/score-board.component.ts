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
  public bonus = new ScoreRow('Bonus', 0, false, false)
  public onePair = new ScoreRow('One Pair', 0, true)
  public twoPair = new ScoreRow('Two Pair', 0, true)
  public threeOfAKind = new ScoreRow('Three of a kind', 0, true)
  public fourOfAKind = new ScoreRow('Four of a kind', 0, true)
  public smallStraight = new ScoreRow('Small straight', 0, true)
  public largeStraight = new ScoreRow('Large straight', 0, true)
  public chance = new ScoreRow('Chance', 0, true)
  public yatzy = new ScoreRow('Yatzy', 0, true)
  public total = new ScoreRow('Total', 0, false)

  private bonusSum: number = 0;

  public scoreBoard = [this.aces, this.twos, this.threes, this.fours, this.fives, this.sixes, this.bonus, this.onePair, this.twoPair, this.threeOfAKind, this.fourOfAKind, this.smallStraight, this.largeStraight, this.chance, this.yatzy, this.total]
  
  public dice: Die[] = [];

  constructor(private diceService: DiceService) { }

  ngOnInit(): void {
    this.diceService.getDice().subscribe(dice => {
      this.dice = dice;
    })
  }

  public setScore(name: string): void {
    switch(name){
      case this.aces.name:
        for(let die of this.dice){
          if(die.side == 1){
            this.aces.score += die.side;
          }
          
        }
          this.bonusSum += this.aces.score;
          this.total.score += this.aces.score;
          this.aces.selectable = false;
          break;
        
        case this.twos.name:
          for(let die of this.dice){
            if(die.side == 2){
              this.twos.score += die.side;
            }
          }
          this.bonusSum += this.twos.score;
          this.total.score += this.twos.score;
          this.twos.selectable = false;
          break;

        case this.threes.name:
          for(let die of this.dice){
            if(die.side == 3){
              this.threes.score += die.side;
            }
          }
          this.bonusSum += this.threes.score;
          this.total.score += this.threes.score;
          this.threes.selectable = false;
          break;

        case this.fours.name:
          for(let die of this.dice){
            if(die.side == 4){
              this.fours.score += die.side;
            }
          }
          this.bonusSum += this.fours.score;
          this.total.score += this.fours.score;
          this.fours.selectable = false;
          break;

        case this.fives.name:
          for(let die of this.dice){
            if(die.side == 5){
              this.fives.score += die.side;
            }
          }
          this.bonusSum += this.fives.score;
          this.total.score += this.fives.score;
          this.fives.selectable = false;
          break;
          
        case this.sixes.name:
          for(let die of this.dice){
            if(die.side == 6){
              this.sixes.score += die.side;
            }
          }
          this.bonusSum += this.sixes.score;
          this.total.score += this.sixes.score;
          this.sixes.selectable = false;
          break;
    }
    
    if(this.aces.score > 0 && 
      this.twos.score > 0 && 
      this.threes.score > 0 && 
      this.fours.score > 0 && 
      this.fives.score > 0 && 
      this.sixes.score > 0 && 
      this.bonusSum >= 63 && 
      this.bonus.bonusApplied == false) {
        this.bonus.score = 35;
        this.bonus.bonusApplied = true;
        this.total.score += this.bonus.score;
    }



    this.diceService.setReset(true);
  }

}
