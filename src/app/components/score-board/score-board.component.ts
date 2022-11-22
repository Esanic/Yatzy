import { Component, OnInit } from '@angular/core';
import { Die } from 'src/app/models/die';
import { Participant } from 'src/app/models/participant';
import { ScoreBoard } from 'src/app/models/score-board';
import { ScoreRow } from 'src/app/models/score-row';
import { DiceService } from 'src/app/services/dice.service';


@Component({
  selector: 'app-scoreBoard',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.css']
})
export class ScoreBoardComponent implements OnInit {
  public scoreBoardHeaders = ['Aces','Twos','Threes','Fours','Fives','Sixes','Bonus','One pair', 'Two pair', 'Three of a kind', 'Four of a kind', 'Small straight', 'Large straight', 'House', 'Chance', 'Yatzy', 'Total']

  public participants: Participant[] = [new Participant('Christopher', false, new ScoreBoard(this.diceService)), new Participant('Anna', false, new ScoreBoard(this.diceService)), new Participant('Jesus', false, new ScoreBoard(this.diceService))]

  public dice: Die[] = [];

  private counter: number = 0;
  private currentParticipant: Participant = new Participant('', false, new ScoreBoard(this.diceService));
  
  constructor(private diceService: DiceService) { }

  ngOnInit(): void {
    this.diceService.getDice().subscribe(dice => {
      this.dice = dice;
    })
    this.setCurrentPlayer();



  }

  public setScore(name: string): void{
    this.currentParticipant.score.setScore(name, this.dice);
    if(this.counter < this.participants.length){
      this.counter++;
    }
    if(this.counter >= this.participants.length){
      this.counter = 0;
    }
    
    this.setCurrentPlayer();
  }

  private setCurrentPlayer(): void {
    this.currentParticipant.currentPlayer = false;
    this.currentParticipant = this.participants[this.counter]
    this.currentParticipant.currentPlayer = true;
  }

  // public setScore(name: string): void {
  //   switch(name){
  //     case this.aces.name:
  //       this.acesThroughSixesScore(1, this.aces);
  //       break;
        
  //     case this.twos.name:
  //       this.acesThroughSixesScore(2, this.twos);
  //       break;

  //     case this.threes.name:
  //       this.acesThroughSixesScore(3, this.threes);
  //       break;

  //     case this.fours.name:
  //       this.acesThroughSixesScore(4, this.fours);
  //       break;

  //     case this.fives.name:
  //       this.acesThroughSixesScore(5, this.fives);
  //       break;
        
  //     case this.sixes.name:
  //       this.acesThroughSixesScore(6, this.sixes);
  //       break;

  //     case this.onePair.name:
  //       let onePairArr = this.mappingOccurencies(2);
  //       let onePairSide = 0;
        
  //       for(let obj of onePairArr){
  //         if(obj[0] > onePairSide){
  //           onePairSide = obj[0];
  //         }
  //       }

  //       this.onePair.score = onePairSide * 2;
  //       this.addTotalScoreAndMakeUnselectable(this.onePair)
  //       break;
      
  //     case this.twoPair.name:
  //       let twoPairArr = this.mappingOccurencies(2);       
  //       let pairOneSides = 0;
  //       let pairTwoSides = 0;

  //       if(twoPairArr.length >= 2){
  //         pairOneSides = twoPairArr[0][0];
  //         pairTwoSides = twoPairArr[1][0];
  //         this.twoPair.score = (pairOneSides * 2)+(pairTwoSides *2);
  //       }
  //       this.addTotalScoreAndMakeUnselectable(this.twoPair);
  //       break;
      
  //     case this.threeOfAKind.name:
  //       let threeOfAKindArr = this.mappingOccurencies(3);
  //       this.threeOfAKind.score = threeOfAKindArr[0][0] * 3;
  //       this.addTotalScoreAndMakeUnselectable(this.threeOfAKind);
  //       break;

  //     case this.fourOfAKind.name:
  //       let fourOfAKindArr = this.mappingOccurencies(4);
  //       this.fourOfAKind.score = fourOfAKindArr[0][0] * 4;
  //       this.addTotalScoreAndMakeUnselectable(this.fourOfAKind);
  //       break;

  //     case this.smallStraight.name:
  //       let sSArr = [];
  //       for(let die of this.dice){
  //         sSArr.push(die.side);
  //       }
  //       if(sSArr.includes(1) && sSArr.includes(2) && sSArr.includes(3) && sSArr.includes(4) && sSArr.includes(5)){
  //         this.smallStraight.score = 15;
  //       }
  //       this.addTotalScoreAndMakeUnselectable(this.smallStraight);
  //       break;
      
  //     case this.largeStraight.name:
  //       let lSArr = [];
  //       for(let die of this.dice){
  //         lSArr.push(die.side);
  //       }
  //       if(lSArr.includes(2) && lSArr.includes(3) && lSArr.includes(4) && lSArr.includes(5) && lSArr.includes(6)){
  //         this.largeStraight.score = 20;
  //       }
  //       this.addTotalScoreAndMakeUnselectable(this.largeStraight);
  //       break;

  //     case this.house.name:
  //       let houseArr = this.mappingOccurencies(2);
  //       if(houseArr.length >= 2){
  //         for(let obj of houseArr){
  //           if(obj[1] == 3)
  //           {
  //             this.house.score = (houseArr[0][0]*houseArr[0][1]) + (houseArr[1][0]*houseArr[1][1])
  //             break;
  //           }
  //         }
  //       }
  //       this.addTotalScoreAndMakeUnselectable(this.house);
  //       break;

  //     case this.chance.name:
  //       for(let die of this.dice){
  //         this.chance.score += die.side;
  //       }
  //       this.addTotalScoreAndMakeUnselectable(this.chance);
  //       break;

  //     case this.yatzy.name:
  //       let yatzyArr = this.mappingOccurencies(5);
  //       if(yatzyArr[0] != undefined && yatzyArr[0][1] == 5){
  //         this.yatzy.score = 50;
  //       }
  //       this.addTotalScoreAndMakeUnselectable(this.yatzy);
  //       break;
  //   }
    
  //   if(this.aces.score > 0 && this.twos.score > 0 && this.threes.score > 0 && this.fours.score > 0 && this.fives.score > 0 && this.sixes.score > 0 && this.bonusSum >= 63 && this.bonus.bonusApplied == false) {
  //     this.bonus.score = 35;
  //     this.bonus.bonusApplied = true;
  //     this.total.score += this.bonus.score;
  //   }
    
  //   this.diceService.setReset(true);
  // }

  // private addTotalScoreAndMakeUnselectable(scoreRow: ScoreRow): void{
  //   this.total.score += scoreRow.score;
  //   scoreRow.selectable = false;
  // }

  // private mappingOccurencies(occurencies: number): any[] {
  //   let arr = [];
  //   for(let die of this.dice){
  //     arr.push(die.side);
  //   }
  //   const map = arr.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
    
  //   let pairArr = []
  //   for(let obj of map){
  //     if(obj[1] >= occurencies){
  //       pairArr.push(obj);
  //     }
  //   }
  //   return pairArr;
  // }

  // private acesThroughSixesScore(dieSide: number, scoreRow: ScoreRow){
  //   for(let die of this.dice){
  //     if(die.side == dieSide){
  //       scoreRow.score += die.side;
  //     }
  //   }
  //   this.bonusSum += scoreRow.score;
  //   this.addTotalScoreAndMakeUnselectable(scoreRow);
  // }

}
