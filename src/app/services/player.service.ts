import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Player } from '../models/player';
import { ScoreBoard } from '../models/score-board';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private clientPlayer: Partial<Player> = {};
  private currentPlayer = new Subject<Player>();
  private chosenMaxPlayers = new BehaviorSubject<number>(0);

  constructor() { }

  public setClientPlayer(player: Player): void {
    this.clientPlayer = player
  }

  public getClientPlayer(): Partial<Player> {
    return this.clientPlayer;
  }

  public setCurrentPlayer(player: Player): void {
    this.currentPlayer.next(player);
  }

  public getCurrentPlayer(): Observable<Player> {
    return this.currentPlayer.asObservable();
  }

  public setChosenMaxPlayers(maxPlayers: any): void {
    this.chosenMaxPlayers.next(maxPlayers);
  }

  public getChosenMaxPlayers(): Observable<any> {
    return this.chosenMaxPlayers.asObservable();
  }
}
