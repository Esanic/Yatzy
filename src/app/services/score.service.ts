import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  private endOfGame: Subject<boolean> = new Subject<boolean>();

  constructor() { }

  public setEndOfGame(bool: boolean): void {
    this.endOfGame.next(bool);
  }

  public getEndOfGame(): Observable<boolean>{
    return this.endOfGame.asObservable();
  }
}
