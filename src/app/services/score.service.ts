import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private endOfGame = new Subject<boolean>();

  constructor(private socketService: SocketService) { }

  public setEndOfGame(endOfGame: boolean): void {
    this.socketService.setGameEnd(this.socketService.roomName);
    this.endOfGame.next(endOfGame);
  }

  public getEndOfGame(): Observable<boolean> {
    return this.endOfGame.asObservable();
  }
}
