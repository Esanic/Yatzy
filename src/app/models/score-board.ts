import { DiceService } from "../services/dice.service"
import { ScoreService } from "../services/score.service"
import { Die } from "./die"
import { ScoreRow } from "./score-row"

export class ScoreBoard {
    aces = new ScoreRow('Aces', 0, true)
    twos = new ScoreRow('Twos', 0, true)
    threes = new ScoreRow('Threes', 0, true)
    fours = new ScoreRow('Fours', 0, true)
    fives = new ScoreRow('Fives', 0, true)
    sixes = new ScoreRow('Sixes', 0, true)
    bonus = new ScoreRow('Bonus', 0, false, false)
    onePair = new ScoreRow('One pair', 0, true)
    twoPair = new ScoreRow('Two pair', 0, true)
    threeOfAKind = new ScoreRow('Three of a kind', 0, true)
    fourOfAKind = new ScoreRow('Four of a kind', 0, true)
    smallStraight = new ScoreRow('Small straight', 0, true)
    largeStraight = new ScoreRow('Large straight', 0, true)
    house = new ScoreRow('House', 0, true)
    chance = new ScoreRow('Chance', 0, true)
    yatzy = new ScoreRow('Yatzy', 0, true)
    total = new ScoreRow('Total', 0, false)

    public scoreBoard: ScoreRow[] = [this.aces, this.twos, this.threes, this.fours, this.fives, this.sixes, this.bonus, this.onePair, this.twoPair, this.threeOfAKind, this.fourOfAKind, this.smallStraight, this.largeStraight, this.house, this.chance, this.yatzy, this.total]

    bonusSum = 0;

    dice: Die[] = [];

    constructor(private diceService: DiceService, private scoreService: ScoreService){
        
    }

    public setScore(name: string, dice: Die[]): void {
      this.dice = dice;
      
      switch(name){
        case this.aces.name:
          this.acesThroughSixesScore(1, this.aces);
          break;
          
        case this.twos.name:
          this.acesThroughSixesScore(2, this.twos);
          break;
  
        case this.threes.name:
          this.acesThroughSixesScore(3, this.threes);
          break;
  
        case this.fours.name:
          this.acesThroughSixesScore(4, this.fours);
          break;
  
        case this.fives.name:
          this.acesThroughSixesScore(5, this.fives);
          break;
          
        case this.sixes.name:
          this.acesThroughSixesScore(6, this.sixes);
          break;
  
        case this.onePair.name:
          let onePairArr = this.mappingOccurencies(2);
          let onePairSide = 0;
          
          for(let obj of onePairArr){
            if(obj[0] > onePairSide){
              onePairSide = obj[0];
            }
          }
  
          this.onePair.score = onePairSide * 2;
          this.addTotalScoreAndMakeUnselectable(this.onePair)
          break;
        
        case this.twoPair.name:
          let twoPairArr = this.mappingOccurencies(2);       
          if(twoPairArr.length >= 2){
            this.twoPair.score = (twoPairArr[0][0] * 2)+(twoPairArr[1][0] *2);
          }
          this.addTotalScoreAndMakeUnselectable(this.twoPair);
          break;
        
        case this.threeOfAKind.name:
          let threeOfAKindArr = this.mappingOccurencies(3);
          if(threeOfAKindArr[0] != undefined){
            this.threeOfAKind.score = threeOfAKindArr[0][0] * 3;
          }
          else{
            this.threeOfAKind.score = 0;
          }
          this.addTotalScoreAndMakeUnselectable(this.threeOfAKind);
          break;
  
        case this.fourOfAKind.name:
          let fourOfAKindArr = this.mappingOccurencies(4);
          if(fourOfAKindArr[0] != undefined){
            this.fourOfAKind.score = fourOfAKindArr[0][0] * 4;
          }
          else{
            this.fourOfAKind.score = 0;
          }
          this.addTotalScoreAndMakeUnselectable(this.fourOfAKind);
          break;
  
        case this.smallStraight.name:
          let sSArr = this.dice.map(die => die.side)
          if(sSArr.includes(1) && sSArr.includes(2) && sSArr.includes(3) && sSArr.includes(4) && sSArr.includes(5)){
            this.smallStraight.score = 15;
          }
          this.addTotalScoreAndMakeUnselectable(this.smallStraight);
          break;
        
        case this.largeStraight.name:
          let lSArr = this.dice.map(die => die.side)
          if(lSArr.includes(2) && lSArr.includes(3) && lSArr.includes(4) && lSArr.includes(5) && lSArr.includes(6)){
            this.largeStraight.score = 20;
          }
          this.addTotalScoreAndMakeUnselectable(this.largeStraight);
          break;
  
        case this.house.name:
          let houseArr = this.mappingOccurencies(2);
          if(houseArr.length >= 2){
            for(let obj of houseArr){
              if(obj[1] == 3)
              {
                this.house.score = (houseArr[0][0]*houseArr[0][1]) + (houseArr[1][0]*houseArr[1][1])
                break;
              }
            }
          }
          this.addTotalScoreAndMakeUnselectable(this.house);
          break;
  
        case this.chance.name:
          for(let die of this.dice){
            this.chance.score += die.side;
          }
          this.addTotalScoreAndMakeUnselectable(this.chance);
          break;
  
        case this.yatzy.name:
          let yatzyArr = this.mappingOccurencies(5);
          if(yatzyArr[0] != undefined && yatzyArr[0][1] == 5){
            this.yatzy.score = 50;
          }
          this.addTotalScoreAndMakeUnselectable(this.yatzy);
          break;
      }
      
      if(this.aces.score > 0 && this.twos.score > 0 && this.threes.score > 0 && this.fours.score > 0 && this.fives.score > 0 && this.sixes.score > 0 && this.bonusSum >= 63 && this.bonus.bonusApplied == false) {
        this.bonus = {name: 'Bonus', score: 35, selectable: false, bonusApplied: true}
        this.total.score += this.bonus.score;
      }
      this.diceService.setReset(true);
    }

    private addTotalScoreAndMakeUnselectable(scoreRow: ScoreRow): void{
        this.total.score += scoreRow.score;
        scoreRow.selectable = false;
    }
    
    private mappingOccurencies(occurencies: number): any[] {
      let arr = this.dice.map(die => die.side);
      const map = arr.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
      
      let pairArr = []
      for(let obj of map){
        if(obj[1] >= occurencies){
          pairArr.push(obj);
        }
      }
      return pairArr;
    }
  
    private acesThroughSixesScore(dieSide: number, scoreRow: ScoreRow){
      for(let die of this.dice){
        if(die.side == dieSide){
          scoreRow.score += die.side;
        }
      }
      this.bonusSum += scoreRow.score;
      this.addTotalScoreAndMakeUnselectable(scoreRow);
    }
    
    public checkEndOfGame(): void {
      let check = this.scoreBoard.every(score => score.selectable == false);
      if(check === true){
        this.scoreService.setEndOfGame(true);
      }
    }
}
    





