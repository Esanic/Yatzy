import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io'
import { Die } from '../models/die';
import { Player } from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public roomName?: string;
  constructor(private socket: Socket) {
  }

  //Emits

  /**
   * Emits the name the user typed in.
   * @date 2023-01-31 - 14:58:21
   * @author Christopher Reineborn
   *
   * @param {string} player - name of the player
   */
  joinRoom(player: string) {
    this.socket.emit('joinRoom', player);
  }

  
  /**
   * Emits an array of dice that was the user hit.
   * @date 2023-01-31 - 14:59:33
   * @author Christopher Reineborn
   *
   * @param {Die[]} dice - the array of dice that was hit.
   */
  diceHit(dice: Die[] ) {
    this.socket.emit('diceHit', dice, this.roomName);
  }

  /**
   * Emits the arrays availableDice and savedDice.
   * @date 2023-01-31 - 15:02:41
   * @author Christopher Reineborn
   *
   * @param {Die[]} availableDice - array of available dice
   * @param {Die[]} savedDice - array of saved dice
   */
  diceMoving(availableDice: Die[], savedDice: Die[]){
    let obj: any = {availableDice: availableDice, savedDice: savedDice}
    this.socket.emit('diceMove', obj, this.roomName)
  }

  
  /**
   * Emit the scorerow name and array of dice used to place score
   * @date 2023-01-31 - 15:06:09
   * @author Christopher Reineborn
   *
   * @param {string} scoreRowName - name of the scorerow to place score on
   * @param {Die[]} dice - the dice to base the score upon
   */
  nextPlayer(scoreRowName: string, dice: Die[]){
    this.socket.emit('nextPlayer', scoreRowName, dice, this.roomName);
  }

  setRoomName(room: string){
    this.roomName = room;
  }

  //Recieves
  
  /**
   * Distributes the room name from the backend
   * @date 2023-01-31 - 15:09:54
   * @author Christopher Reineborn
   * 
   * @returns {*}
   */
  getRoomName(){
   return this.socket.fromEvent<string>('roomName');
  }
  
  
  /**
   * Distributes if the game room is full from the backend
   * @date 2023-01-31 - 15:10:34
   * @author Christopher Reineborn 
   *
   * @returns {*}
   */
  getRoomFull(){
    return this.socket.fromEvent<boolean>('fullGame');
  }

  /**
   * Distributes the array of players in the game room from the backend.
   * @date 2023-01-31 - 15:11:04
   * @author Christopher Reineborn
   *
   * @returns {*}
   */
  getPlayers() {
    return this.socket.fromEvent('players');
  }

  
  /**
   * Distributes the array of dice that was hit from the backend.
   * @date 2023-01-31 - 15:12:19
   * @author Christopher Reineborn
   *
   * @returns {*}
   */
  getDiceHit(){
    return this.socket.fromEvent<Die[]>('getDice');
  }

  
  /**
   * Distributes the arrays of saved and available dice.
   * @date 2023-01-31 - 15:12:54
   * @author Christopher Reineborn
   *
   * @returns {*}
   */
  getDiceMovement(){
    return this.socket.fromEvent('getDiceMovement');
  }

  
  /**
   * Distributes what scorerow and dice the emitting player used to put score
   * @date 2023-01-31 - 15:13:40
   * @author Christopher Reineborn
   *
   * @returns {*}
   */
  getNextPlayer(){
    return this.socket.fromEvent('getNextPlayer');
  }

  
  /**
   * Distrbutes the users socket id from the backend
   * @date 2023-01-31 - 15:14:34
   *
   * @returns {*}
   */
  getUserID(){
    return this.socket.fromEvent<string>('userID');
  }
}


