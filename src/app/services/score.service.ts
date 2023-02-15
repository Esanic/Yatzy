import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private endOfGame = new Subject<boolean>();

  constructor(private socketService: SocketService) { }

  
  /**
   * Setting the end of game in the subject and emits it to the backend
   * @date 2/15/2023 - 2:47:30 PM
   * @author Christopher Reineborn
   *
   * @public
   * @param {boolean} endOfGame - boolean to see if the game is done
   */
  public setEndOfGame(endOfGame: boolean): void {
    this.socketService.setGameEnd(this.socketService.roomName);
    this.endOfGame.next(endOfGame);
  }

  
  /**
   * Distributes the end of game to subscribers
   * @date 2/15/2023 - 2:48:26 PM
   * @author Christopher Reineborn
   *
   * @public
   * @returns {Observable<boolean>} - An observable of the end of game
   */
  public getEndOfGame(): Observable<boolean> {
    return this.endOfGame.asObservable();
  }
}
