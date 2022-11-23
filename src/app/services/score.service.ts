import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private endOfGame = new Subject<boolean>();

  constructor() { }

  public setEndOfGame(endOfGame: boolean): void {
    this.endOfGame.next(endOfGame);
  }

  public getEndOfGame(): Observable<boolean> {
    return this.endOfGame.asObservable();
  }
}
