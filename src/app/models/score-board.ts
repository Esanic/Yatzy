import { NgbModal } from "@ng-bootstrap/ng-bootstrap"
import { LangChangeEvent, TranslateService } from "@ngx-translate/core"
import { firstValueFrom, Subscription } from "rxjs"
import { SetScoreConfirmationComponent } from "../components/modals/set-score-confirmation/set-score-confirmation.component"
import { DiceService } from "../services/dice.service"
import { PlayerService } from "../services/player.service"
import { ScoreService } from "../services/score.service"
import { Die } from "./die"
import { Player } from "./player"
import { ScoreRow } from "./score-row"

export class ScoreBoard {
    aces = new ScoreRow(this.translateService.instant('DICE.ACES'), 0, true)
    twos = new ScoreRow(this.translateService.instant('DICE.TWOS'), 0, true)
    threes = new ScoreRow(this.translateService.instant('DICE.THREES'), 0, true)
    fours = new ScoreRow(this.translateService.instant('DICE.FOURS'), 0, true)
    fives = new ScoreRow(this.translateService.instant('DICE.FIVES'), 0, true)
    sixes = new ScoreRow(this.translateService.instant('DICE.SIXES'), 0, true)
    subTotal = new ScoreRow(this.translateService.instant('DICE.SUBTOTAL'), 0, false)
    bonus = new ScoreRow(this.translateService.instant('DICE.BONUS'), 0, false, false)
    onePair = new ScoreRow(this.translateService.instant('DICE.ONEPAIR'), 0, true)
    twoPair = new ScoreRow(this.translateService.instant('DICE.TWOPAIR'), 0, true)
    threeOfAKind = new ScoreRow(this.translateService.instant('DICE.THREEOFAKIND'), 0, true)
    fourOfAKind = new ScoreRow(this.translateService.instant('DICE.FOUROFAKIND'), 0, true)
    smallStraight = new ScoreRow(this.translateService.instant('DICE.SMALLSTRAIGHT'), 0, true)
    largeStraight = new ScoreRow(this.translateService.instant('DICE.LARGESTRAIGHT'), 0, true)
    house = new ScoreRow(this.translateService.instant('DICE.HOUSE'), 0, true)
    chance = new ScoreRow(this.translateService.instant('DICE.CHANCE'), 0, true)
    yatzy = new ScoreRow(this.translateService.instant('DICE.YATZY'), 0, true)
    total = new ScoreRow(this.translateService.instant('DICE.TOTAL'), 0, false)

    public scoreBoard: ScoreRow[] = [this.aces, this.twos, this.threes, this.fours, this.fives, this.sixes, this.subTotal, this.bonus, this.onePair, this.twoPair, this.threeOfAKind, this.fourOfAKind, this.smallStraight, this.largeStraight, this.house, this.chance, this.yatzy, this.total]

    bonusSum = 0;

    dice: Die[] = [];

    clientPlayerSid: string = "";
    currentPlayerSid: string = "";

    private subLangChange$: Subscription = new Subscription();

    constructor(
      private diceService: DiceService, 
      private scoreService: ScoreService, 
      private translateService: TranslateService, 
      private modal: NgbModal
      ) {
      this.subLangChange$ = this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
        this.translateService.stream('DICE').subscribe(translation => {
          const scoreRowNames: string[] = Object.keys(translation);
          for(let i = 0; i < this.scoreBoard.length; i++){
            this.scoreBoard[i].name = translation[scoreRowNames[i]]
          }
        })
      })
    }

    /**
     * Sets the score depending on what scorerow the user picks and the values of the dice.
     * @date 2023-01-31 - 13:45:09
     * @author Christopher Reineborn
     *
     * @public
     * @param {string} scoreRowName - String to determine where to put the score.
     * @param {Die[]} dice - Array of dice to detemine what score the scorerow will recieve.
     */
    public async setScore(scoreRowName: string, dice: Die[], currentPlayer: string, clientPlayer: string): Promise<boolean> {
      this.currentPlayerSid = currentPlayer;
      this.clientPlayerSid = clientPlayer;
      let modal: boolean;
      this.dice = dice;
      return new Promise<boolean>(async resolve => {
        switch(scoreRowName){
          case this.aces.name:
            modal = await this.acesThroughSixesScore(1, this.aces);
            break;
            
          case this.twos.name:
            modal = await this.acesThroughSixesScore(2, this.twos);
            break;
    
          case this.threes.name:
            modal = await this.acesThroughSixesScore(3, this.threes);
            break;
    
          case this.fours.name:
            modal = await this.acesThroughSixesScore(4, this.fours);
            break;
    
          case this.fives.name:
            modal = await this.acesThroughSixesScore(5, this.fives);
            break;
            
          case this.sixes.name:
            modal = await this.acesThroughSixesScore(6, this.sixes);
            break;
    
          case this.onePair.name:
            let onePairSide = 0;
            this.mapOccurencies(2).map(obj => obj[0] > onePairSide ? onePairSide = obj[0] : null);
            this.onePair.score = onePairSide * 2;
            modal = await this.addTotalScoreAndMakeUnselectable(this.onePair)
            break;
          
          case this.twoPair.name:
            let twoPairArr = this.mapOccurencies(2);
            twoPairArr.length >= 2 ? this.twoPair.score = (twoPairArr[0][0] * 2)+(twoPairArr[1][0] *2) : null;  
            modal = await this.addTotalScoreAndMakeUnselectable(this.twoPair);
            break;
          
          case this.threeOfAKind.name:
            let threeOfAKindArr = this.mapOccurencies(3);
            threeOfAKindArr[0] != undefined ? this.threeOfAKind.score = threeOfAKindArr[0][0] * 3 : this.threeOfAKind.score = 0;
            modal = await this.addTotalScoreAndMakeUnselectable(this.threeOfAKind);
            break;
    
          case this.fourOfAKind.name:
            let fourOfAKindArr = this.mapOccurencies(4);
            fourOfAKindArr[0] != undefined ? this.fourOfAKind.score = fourOfAKindArr[0][0] * 4 : this.fourOfAKind.score = 0;
            modal = await this.addTotalScoreAndMakeUnselectable(this.fourOfAKind);
            break;
    
          case this.smallStraight.name:
            let smallStraightArr = this.dice.map(die => die.side)
            smallStraightArr.includes(1) && smallStraightArr.includes(2) && smallStraightArr.includes(3) && smallStraightArr.includes(4) && smallStraightArr.includes(5) ? this.smallStraight.score = 15 : null;
            modal = await this.addTotalScoreAndMakeUnselectable(this.smallStraight);
            break;
          
          case this.largeStraight.name:
            let largeStraightArr = this.dice.map(die => die.side)
            largeStraightArr.includes(2) && largeStraightArr.includes(3) && largeStraightArr.includes(4) && largeStraightArr.includes(5) && largeStraightArr.includes(6) ? this.largeStraight.score = 20 : null;
            modal = await this.addTotalScoreAndMakeUnselectable(this.largeStraight);
            break;
    
          case this.house.name:
            let houseArr = this.mapOccurencies(2);
            houseArr.length >= 2 ? houseArr.map(obj => obj[1] == 3 ? this.house.score =(houseArr[0][0]*houseArr[0][1]) + (houseArr[1][0]*houseArr[1][1]) : null) : null;
            modal = await this.addTotalScoreAndMakeUnselectable(this.house);
            break;
    
          case this.chance.name:
            this.dice.map(die => this.chance.score += die.side);
            modal = await this.addTotalScoreAndMakeUnselectable(this.chance);
            break;
    
          case this.yatzy.name:
            let yatzyArr = this.mapOccurencies(5);
            yatzyArr[0] != undefined && yatzyArr[0][1] == 5 && this.dice.some(die => {die.side !== 0})? this.yatzy.score = 50 : null;
            modal = await this.addTotalScoreAndMakeUnselectable(this.yatzy);
            break;
        }
        
        if(this.aces.score > 0 && this.twos.score > 0 && this.threes.score > 0 && this.fours.score > 0 && this.fives.score > 0 && this.sixes.score > 0 && this.bonusSum >= 63 && this.bonus.bonusApplied == false) {
          Object.assign(this.bonus, {score: 50, bonusApplied: true})
          this.total.score += this.bonus.score;
        }
        this.diceService.setNewTurn(true);

        resolve(modal);
      })
      
    }

    /**
     * Used to determine what score the scorerows would give based upon the current dice.
     * @date 2023-01-31 - 13:51:10
     * @author Christopher Reineborn
     *
     * @public
     * @param {string[]} names - array of scorerow names
     * @param {Die[]} dice - the current dice and their value
     * @returns {number[]} - returns an array of numbers, indexed after @param names, with each number representing the score the user would recieve if choosing that scorerow.
     */
    public possibleScore(names: any, dice: Die[]): number[] {
      let possibleScores: number[] = [];
      this.dice = dice;

      for(let name of names){
        switch(name){
          case this.bonus.name:
            possibleScores.push(0);
            break;
          case this.subTotal.name:
            possibleScores.push(0);
            break;
          case this.total.name:
            possibleScores.push(0);
          break;

          case this.aces.name:
            possibleScores.push(this.acesThroughSixesScorePossibleScore(1));
            break;
            
          case this.twos.name:
            possibleScores.push(this.acesThroughSixesScorePossibleScore(2));
            break;
    
          case this.threes.name:
            possibleScores.push(this.acesThroughSixesScorePossibleScore(3));
            break;
    
          case this.fours.name:
            possibleScores.push(this.acesThroughSixesScorePossibleScore(4));
            break;
    
          case this.fives.name:
            possibleScores.push(this.acesThroughSixesScorePossibleScore(5));
            break;
            
          case this.sixes.name:
            possibleScores.push(this.acesThroughSixesScorePossibleScore(6));
            break;
    
          case this.onePair.name:
            let onePairSide = 0;
            this.mapOccurencies(2).map(obj => obj[0] > onePairSide ? onePairSide = obj[0] : null);
            possibleScores.push((onePairSide * 2));
            break;
          
          case this.twoPair.name:
            let twoPairArr = this.mapOccurencies(2);
            twoPairArr.length >= 2 ? possibleScores.push((twoPairArr[0][0] * 2)+(twoPairArr[1][0] *2)) : possibleScores.push(0);
            break;
          
          case this.threeOfAKind.name:
            let threeOfAKindArr = this.mapOccurencies(3);
            threeOfAKindArr[0] != undefined && threeOfAKindArr[0][1] == 3? possibleScores.push((threeOfAKindArr[0][0] * 3)) : possibleScores.push(0);
            break;
    
          case this.fourOfAKind.name:
            let fourOfAKindArr = this.mapOccurencies(4);
            fourOfAKindArr[0] != undefined && fourOfAKindArr[0][1] == 4? possibleScores.push((fourOfAKindArr[0][0] * 4)) : possibleScores.push(0);
            break;
    
          case this.smallStraight.name:
            let smallStraightArr = this.dice.map(die => die.side)
            smallStraightArr.includes(1) && smallStraightArr.includes(2) && smallStraightArr.includes(3) && smallStraightArr.includes(4) && smallStraightArr.includes(5) ? possibleScores.push(15) : possibleScores.push(0);
            break;
          
          case this.largeStraight.name:
            let largeStraightArr = this.dice.map(die => die.side)
            largeStraightArr.includes(2) && largeStraightArr.includes(3) && largeStraightArr.includes(4) && largeStraightArr.includes(5) && largeStraightArr.includes(6) ? possibleScores.push(20) : possibleScores.push(0);
            break;
    
          case this.house.name:
            let houseArr = this.mapOccurencies(2);
            if(houseArr.length >= 2){
              if(houseArr[0][1] == 3 || houseArr[1][1] == 3){
                possibleScores.push(((houseArr[0][0]*houseArr[0][1]) + (houseArr[1][0]*houseArr[1][1])))
              }
              else{
                possibleScores.push(0)
              }
            }
            else{
              possibleScores.push(0)
            }
            break;
    
          case this.chance.name:
            let scoreChance = 0;
            this.dice.map(die => scoreChance += die.side);
            possibleScores.push(scoreChance);
            break;
    
          case this.yatzy.name:
            let yatzyArr = this.mapOccurencies(5);
            yatzyArr[0] != undefined && yatzyArr[0][1] == 5 ? possibleScores.push(50) : possibleScores.push(0);
            break;
        }
      }
      return possibleScores;
    }

    
    /**
     * Adds the selected scorerow score to the total and makes it unselectable.
     * @date 2023-01-31 - 13:57:31
     * @author Christopher Reineborn
     *
     * @private
     * @param {ScoreRow} scoreRow - what scorerow to retrieve score from.
     */
    private async addTotalScoreAndMakeUnselectable(scoreRow: ScoreRow): Promise<boolean>{
      return new Promise<boolean>(async resolve => {
        if(scoreRow.score === 0){
          if(this.clientPlayerSid === this.currentPlayerSid){
            const modalRef = this.modal.open(SetScoreConfirmationComponent, {centered: true});
            modalRef.componentInstance.scoreRow = scoreRow.name;
            modalRef.result.then(
              (result) => {
                if(result === true){
                  this.total.score += scoreRow.score;
                  scoreRow.selectable = false;
                  resolve(true)
                }
            });
          }
          else {
            this.total.score += scoreRow.score;
            scoreRow.selectable = false;
            resolve(false);
          }       

        }
        if(scoreRow.score > 0){
          this.total.score += scoreRow.score;
          scoreRow.selectable = false;
          resolve(false);
        }
      })
    }
    
    
    /**
     * Creates an array where it groups each value of the dice with amount of occurencies 
     * @date 2023-01-31 - 13:59:23
     * @author Christopher Reineborn
     *
     * @private
     * @param {number} desiredOccurencies - minimum of occurencies that is going to be included in the returning array
     * @returns {any[]} - array of values grouped with occurencies of said value.
     */
    private mapOccurencies(desiredOccurencies: number): any[] {
      let arr = this.dice.map(die => die.side != 0 ? die.side : null);
      const map = arr.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
      
      let pairArr = []
      for(let obj of map){
        if(obj[1] >= desiredOccurencies){
          pairArr.push(obj);
        }
      }
      return pairArr;
    }
  
    /**
     * Increments the scorerow with each die that has the same value as @param dieSide
     * @date 2023-01-31 - 14:35:03
     * @author Christopher Reineborn
     *
     * @private
     * @param {number} dieSide - value to look for in each die.
     * @param {ScoreRow} scoreRow - scorerow to add the score to.
     */
    private async acesThroughSixesScore(dieSide: number, scoreRow: ScoreRow): Promise<boolean>{
      let modal: boolean;
      return new Promise<boolean>(async resolve => {
        this.dice.map(die => die.side === dieSide ? scoreRow.score += die.side : null)
        this.bonusSum += scoreRow.score;
        this.subTotal.score += scoreRow.score;
        modal = await this.addTotalScoreAndMakeUnselectable(scoreRow);
        resolve(modal);
      })

    }

    /**
     * Increments the possible score with each die that has the same value as @param dieSide
     * @date 2023-01-31 - 14:42:24
     * @author Christopher Reineborn
     *
     * @private
     * @param {number} dieSide - value to look for in each die.
     * @returns {number}
     */
    private acesThroughSixesScorePossibleScore(dieSide:number): number{
      let score = 0;
      this.dice.map(die => die.side === dieSide ? score += die.side : null)
      return score;
    }

    
    /**
     * Controls if all the scorerows in the scoreboard has had their property selectable set to false.
     * @date 2023-01-31 - 14:43:36
     * @author Christopher Reineborn
     *
     * @public
     */
    public checkEndOfGame(): void {
      let check = this.scoreBoard.every(score => score.selectable == false);
      if(check === true){
        this.scoreService.setEndOfGame(true);
      }
    }
}
    





