import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Die } from 'src/app/models/die';
import { Participant } from 'src/app/models/participant';
import { ScoreBoard } from 'src/app/models/score-board';
import { ScoreRow } from 'src/app/models/score-row';
import { DiceService } from 'src/app/services/dice.service';
import { ParticipantService } from 'src/app/services/participant.service';
import { ScoreService } from 'src/app/services/score.service';
import { SocketService } from 'src/app/services/socket.service';


@Component({
  selector: 'app-scoreBoard',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.css']
})
export class ScoreBoardComponent implements OnInit {
  public scoreBoardHeaders = ['Aces','Twos','Threes','Fours','Fives','Sixes', 'Subtotal', 'Bonus', 'One pair', 'Two pair', 'Three of a kind', 'Four of a kind', 'Small straight', 'Large straight', 'House', 'Chance', 'Yatzy', 'Total']

  public participants: Participant[] = [];
  private lastParticipant: Participant = this.participants.slice(-1)[0];
  private currentParticipant: Participant = new Participant('', false, new ScoreBoard(this.diceService, this.scoreService));

  private dice: Die[] = [];

  public possibleScores: number[] = []

  private counter: number = 0;
  public diceHit: boolean = false;

  @ViewChild('content', {read: TemplateRef}) content!: TemplateRef<any>;

  constructor(private socketService: SocketService, private diceService: DiceService, private scoreService: ScoreService, private participantService: ParticipantService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.diceService.getDice().subscribe(async dice => {
      this.dice = dice;
      this.possibleScores = this.currentParticipant.score.possibleScore(this.scoreBoardHeaders, this.dice);
      this.diceHit = true;
    })
    
    this.participantService.getParticipant().subscribe(participant => {
      this.participants.push(new Participant(participant, false, new ScoreBoard(this.diceService, this.scoreService)));
      this.lastParticipant = this.participants.slice(-1)[0];
      this.setCurrentPlayer();
    })

    this.scoreService.getEndOfGame().subscribe(bool => {
      this.participants.sort((a:Participant, b:Participant) => b.score.total.score - a.score.total.score)
      bool ? this.modalService.open(this.content, {centered: true, animation: true, keyboard: true}) : null;
    })
  }


  public setScore(name: string): void{
    this.currentParticipant.score.setScore(name, this.dice);
    this.lastParticipant.score.checkEndOfGame();
    
    if(this.counter < this.participants.length){
      this.counter++;
    }
    if(this.counter >= this.participants.length){
      this.counter = 0;
    }
    this.possibleScores = [];
    this.setCurrentPlayer();
  }

  private setCurrentPlayer(): void {
    this.currentParticipant.currentPlayer = false;
    this.currentParticipant = this.participants[this.counter]
    this.currentParticipant.currentPlayer = true;
    this.diceHit = false;
  }

  public closeModalAndReset(): void {
    this.modalService.dismissAll()
    this.diceService.setReset(true);
    this.participantService.setDisableAddPlayers(false);
    this.participants = [];
  }

  private test(): void {
    this.currentParticipant.score
  }


}
 