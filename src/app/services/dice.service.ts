import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Die } from '../models/die';

@Injectable({
  providedIn: 'root'
})
export class DiceService {
  public dice = new Subject<Die[]>();
  public reset = new Subject<boolean>();

  constructor() { }

  public setDice(dice: Die[]): void {
    this.dice.next(dice);
  }

  public getDice(): Observable<Die[]> {
    return this.dice.asObservable();
  }

  public setReset(reset: boolean): void {
    this.reset.next(reset);
  }

  public getReset(): Observable<boolean> {
    return this.reset.asObservable();
  }
}
