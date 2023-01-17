import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Die } from 'src/app/models/die';
import { Player } from 'src/app/models/player';
import { ScoreBoard } from 'src/app/models/score-board';
import { DiceService } from 'src/app/services/dice.service';
import { PlayerService } from 'src/app/services/player.service';
import { ScoreService } from 'src/app/services/score.service';
import { SocketService } from 'src/app/services/socket.service';


@Component({
  selector: 'app-scoreBoard',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.css']
})
export class ScoreBoardComponent implements OnInit {
  public scoreBoardHeaders = ['Aces','Twos','Threes','Fours','Fives','Sixes', 'Subtotal', 'Bonus', 'One pair', 'Two pair', 'Three of a kind', 'Four of a kind', 'Small straight', 'Large straight', 'House', 'Chance', 'Yatzy', 'Total']

  public players: Player[] = [];
  public clientPlayer: string = "";
  private lastPlayer: Player = this.players.slice(-1)[0];
  private currentPlayer: Player = new Player('', false, new ScoreBoard(this.diceService, this.scoreService));

  private dice: Die[] = [];

  public possibleScores: number[] = []

  private counter: number = 0;
  public diceHit: boolean = false;

  @ViewChild('content', {read: TemplateRef}) content!: TemplateRef<any>;

  constructor(private socketService: SocketService, private diceService: DiceService, private scoreService: ScoreService, private PlayerService: PlayerService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.clientPlayer = this.PlayerService.getClientPlayer();

    this.diceService.getDice().subscribe(dice => {
      this.dice = dice;
      this.possibleScores = this.currentPlayer.score.possibleScore(this.scoreBoardHeaders, this.dice);
      this.diceHit = true;
    });

    this.socketService.getPlayers().subscribe((players: any) => {
      players.forEach((player: any) => {
        this.players.push(new Player(player.name, false, new ScoreBoard(this.diceService, this.scoreService)));
      });
      this.lastPlayer = this.players.slice(-1)[0];
      this.setCurrentPlayer();
    });

    this.scoreService.getEndOfGame().subscribe(bool => {
      this.players.sort((a:Player, b:Player) => b.score.total.score - a.score.total.score)
      bool ? this.modalService.open(this.content, {centered: true, animation: true, keyboard: true}) : null;
    })
  }


  public setScore(name: string): void{
    this.currentPlayer.score.setScore(name, this.dice);
    this.lastPlayer.score.checkEndOfGame();
    
    if(this.counter < this.players.length){
      this.counter++;
    }
    if(this.counter >= this.players.length){
      this.counter = 0;
    }
    this.possibleScores = [];
    this.setCurrentPlayer();
  }

  private setCurrentPlayer(): void {
    this.currentPlayer.currentPlayer = false;
    this.currentPlayer = this.players[this.counter]
    this.PlayerService.setCurrentPlayer(this.currentPlayer.name);
    this.currentPlayer.currentPlayer = true;
    this.diceHit = false;
  }

  public closeModalAndReset(): void {
    this.modalService.dismissAll()
    this.diceService.setReset(true);
    this.PlayerService.setDisableAddPlayers(false);
    this.players = [];
  }


}
 