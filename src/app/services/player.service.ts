import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Player } from '../models/player';
import { ScoreBoard } from '../models/score-board';
import { DiceService } from './dice.service';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  // private clientPlayer: Player = {name: "", socketId: "", currentPlayer: true, score: new ScoreBoard(this.diceService, this.translateService, this.modal, this.socketService)};
  private currentPlayer = new Subject<Player>();
  private clientPlayerSid = new Subject<string>();
  private clientPlayerSidString: string = "";
  private chosenMaxPlayers = new BehaviorSubject<number>(0);
  private clientPlayer = new BehaviorSubject<Player>({name: "", socketId: "", currentPlayer: true, score: new ScoreBoard(this.diceService, this.translateService, this.modal, this.socketService)})

  constructor(private diceService: DiceService, private socketService: SocketService, private translateService: TranslateService, private modal: NgbModal) { }

  public setClientPlayerSid(sid: string): void {
    this.clientPlayerSidString = sid;
    this.clientPlayerSid.next(sid);
  }

  public getClientPlayerSid(): Observable<string> {
    return this.clientPlayerSid.asObservable();
  }

  public getClientPlayerSidString(): string {
    return this.clientPlayerSidString;
  }

  /**
   * Setting the client player
   * @date 2/15/2023 - 2:18:07 PM
   * @author Christopher Reineborn
   *
   * @public
   * @param {Player} player - the client player.
   */
  public setClientPlayer(player: Player): void {
    this.clientPlayer.next(player);
    // this.clientPlayer = player
  }

  /**
   * Return the client player
   * @date 2/15/2023 - 2:18:26 PM
   * @author Christopher Reineborn
   *
   * @public
   * @returns {Player} - the client player
   */
  public getClientPlayer(): Observable<Player> {
    return this.clientPlayer.asObservable();
    // return this.clientPlayer;
  }

  /**
   * Setting the current player to be distributed to subscribers
   * @date 2/15/2023 - 2:19:09 PM
   * @author Christopher Reineborn
   *
   * @public
   * @param {Player} player - Current player to be set in the Subject
   */
  public setCurrentPlayer(player: Player): void {
    this.currentPlayer.next(player);
  }

  
  /**
   * Distributes the current player to subscribers.
   * @date 2/15/2023 - 2:20:01 PM
   * @author Christopher Reineborn
   *
   * @public
   * @returns {Observable<Player>} - An observable of the current player.
   */
  public getCurrentPlayer(): Observable<Player> {
    return this.currentPlayer.asObservable();
  }

  
  /**
   * Setting the chosen max player
   * @date 2/15/2023 - 2:20:32 PM
   * @author Christopher Reineborn
   *
   * @public
   * @param {number} maxPlayers - Chosen max player to be set in the Subject
   */
  public setChosenMaxPlayers(maxPlayers: number): void {
    this.chosenMaxPlayers.next(maxPlayers);
  }

  
  /**
   * Distributes the chosen max player to subscribers.
   * @date 2/15/2023 - 2:46:40 PM
   * @author Christopher Reineborn
   *
   * @public
   * @returns {Observable<number>} - An observable of the chosen max player.
   */
  public getChosenMaxPlayers(): Observable<number> {
    return this.chosenMaxPlayers.asObservable();
  }
}
