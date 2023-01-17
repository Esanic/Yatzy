import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private clientPlayer: string = "";
  private currentPlayer = new Subject<string>();
  private disableButton = new Subject<boolean>();

  constructor() { }

  public setClientPlayer(Player: string): void {
    this.clientPlayer = Player
  }

  public getClientPlayer(): string {
    return this.clientPlayer;
  }

  public setCurrentPlayer(Player: string): void {
    this.currentPlayer.next(Player);
  }

  public getCurrentPlayer(): Observable<string> {
    return this.currentPlayer.asObservable();
  }

  public setDisableAddPlayers(disableButton: boolean): void {
    this.disableButton.next(disableButton);
  }

  public getDisableAddPlayers(): Observable<boolean> {
    return this.disableButton.asObservable();
  }
}
