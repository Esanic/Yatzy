import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Die } from '../models/die';

@Injectable({
  providedIn: 'root'
})
export class DiceService {
  public dice = new Subject<Die[]>();
  public reset = new Subject<boolean>();
  public newTurn = new Subject<boolean>();

  constructor() { }

  
  /**
   * Setting the dice to be distributed to subscribers.
   * @date 2/15/2023 - 1:27:58 PM
   * @author Christopher Reineborn
   *
   * @public
   * @param {Die[]} dice - Dice array to be set in the Subject
   */
  public setDice(dice: Die[]): void {
    this.dice.next(dice);
  }

  /**
   * Distributes the dice to subscribers
   * @date 2/15/2023 - 1:29:02 PM
   * @author Christopher Reineborn
   *
   * @public
   * @returns {Observable<Die[]>} - An observable of the dice
   */
  public getDice(): Observable<Die[]> {
    return this.dice.asObservable();
  }

  
  /**
   * Setting the reset state to be distributed to subscribers
   * @date 2/15/2023 - 2:14:02 PM
   * @author Christopher Reineborn
   *
   * @public
   * @param {boolean} reset - Reset state to be set in the Subject
   */
  public setReset(reset: boolean): void {
    this.reset.next(reset);
  }

  /**
   * Distributes the reset state to subscribers
   * @date 2/15/2023 - 2:15:02 PM
   * @author Christopher Reineborn
   *
   * @public
   * @returns {Observable<boolean>} - An observable of the reset state
   */
  public getReset(): Observable<boolean> {
    return this.reset.asObservable();
  }


  /**
   * Set the new turn state to be distributed to subscribers
   * @date 2/15/2023 - 2:16:36 PM
   * @author Christopher Reineborn
   *
   * @public
   * @param {boolean} reset - New turn state to be set in the Subject
   */
  public setNewTurn(reset: boolean): void {
    this.newTurn.next(reset);
  }

  
  /**
   * Distributes the new turn state to subscribers
   * @date 2/15/2023 - 2:17:12 PM
   * @author Christopher Reineborn
   *
   * @public
   * @returns {Observable<boolean>} - An observable of the new turn state
   */
  public getNewTurn(): Observable<boolean> {
    return this.newTurn.asObservable();
  }
}
