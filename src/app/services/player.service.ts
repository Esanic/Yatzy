import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Player } from '../models/player';
import { ScoreBoard } from '../models/score-board';
import { DiceService } from './dice.service';
import { ScoreService } from './score.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private clientPlayer: Player = {name: "", socketId: "", currentPlayer: true, score: new ScoreBoard(this.diceService, this.scoreService, this.translateService, this.modal)};
  private currentPlayer = new Subject<Player>();
  private chosenMaxPlayers = new BehaviorSubject<number>(0);

  constructor(private diceService: DiceService, private scoreService: ScoreService, private translateService: TranslateService, private modal: NgbModal) { }

  public setClientPlayer(player: Player): void {
    this.clientPlayer = player
  }

  public getClientPlayer(): Player {
    return this.clientPlayer;
  }

  public setCurrentPlayer(player: Player): void {
    this.currentPlayer.next(player);
  }

  public getCurrentPlayer(): Observable<Player> {
    return this.currentPlayer.asObservable();
  }

  public setChosenMaxPlayers(maxPlayers: number): void {
    this.chosenMaxPlayers.next(maxPlayers);
  }

  public getChosenMaxPlayers(): Observable<number> {
    return this.chosenMaxPlayers.asObservable();
  }
}
