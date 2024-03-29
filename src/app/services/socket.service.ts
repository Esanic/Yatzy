import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io'
import { Die } from '../models/die';
import { Player } from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public roomName: string = "";
  
  constructor(private socket: Socket) {
  }

  /**
   * Method to set the room name locally
   * @date 2/15/2023 - 2:53:07 PM
   * @author Christopher Reineborn
   *
   * @param {string} room - room name to be set.
   */
    setRoomName(room: string){
      this.roomName = room;
    }
    
  //Emits
   /**
    * Emitting random value in order to trigger online-check from server.
    * @date 2023-02-02 - 15:28:15
    * @author Christopher Reineborn
    *
    * @returns {*}
    */
  triggerOnlineCheck(x: any){
    this.socket.emit('checkOnline', x);
  }

  /**
   * Emits the name the user typed in.
   * @date 2023-01-31 - 14:58:21
   * @author Christopher Reineborn
   *
   * @param {string} player - name of the player
   */
  joinRoom(player: string, maxPlayers: number) {
    this.socket.emit('joinRoom', player, maxPlayers);
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
  diceMoving(incDice: Die[]){
    let dice: Die[] = incDice;
    this.socket.emit('diceMove', dice, this.roomName)
  }
  
  /**
   * Emit the scorerow name and array of dice used to place score
   * @date 2023-01-31 - 15:06:09
   * @author Christopher Reineborn
   *
   * @param {string} scoreRowName - name of the scorerow to place score on
   * @param {Die[]} dice - the dice to base the score upon
   */
  nextPlayer(scoreRowId: number, dice: Die[]){
    this.socket.emit('nextPlayer', scoreRowId, dice, this.roomName);
  }

  /**
   * Emit that the game has ended.
   * @date 2/15/2023 - 2:50:09 PM
   * @author Christopher Reineborn
   *
   * @param {string} room - room to distribute the message to.
   */
  setEndOfGame(room: string){
    this.socket.emit('gameDone', room);
  }

  /**
   * Trigger to recieve queue numbers
   * @date 2/15/2023 - 2:50:45 PM
   * @author Christopher Reineborn
   *
   * @param {*} x
   */
  triggerQueueNumbers(x: any){
    this.socket.emit('triggerQueue', x);
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
   * Distributes the number of players currently in the socket room
   * @date 2023-02-02 - 15:30:21
   *
   * @returns {*}
   */
  getAmtOfPlayersInRoom(){
    return this.socket.fromEvent('amtOfPlayers')
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
  getCurrentPlayerResult(){
    return this.socket.fromEvent('getNextPlayer');
  }

  /**
   * Distributes the users socket id from the backend
   * @date 2023-01-31 - 15:14:34
   * @author Christopher Reineborn
   *
   * @returns {*}
   */
  getUserID(){
    return this.socket.fromEvent<string>('userID');
  }
  
  /**
   * Distributes disconnected player
   * @date 2023-02-02 - 15:31:13
   * @author Christopher Reineborn
   *
   * @returns {*}
   */
  getDisconnectedPlayer(){
    return this.socket.fromEvent<string>('disconnected');
  }
  
  /**
   * Distributes disconnected player while in two player queue.
   * @date 2023-02-02 - 15:31:58
   * @author Christopher Reineborn
   *
   * @returns {*}
   */
  getDisconnectedPlayerInTwoQueue(){
    return this.socket.fromEvent<number>('disconnectedInQueueTwo')
  }
  
  /**
   * Distributes disconnected player while in three player queue.
   * @date 2023-02-02 - 15:32:26
   * @author Christopher Reineborn
   *
   * @returns {*}
   */
  getDisconnectedPlayerInThreeQueue(){
    return this.socket.fromEvent<number>('disconnectedInQueueThree')
  }
  
  /**
   * Distributes disconnected player while in four player queue.
   * @date 2023-02-02 - 15:32:37
   * @author Christopher Reineborn
   *
   * @returns {*}
   */
  getDisconnectedPlayerInFourQueue(){
    return this.socket.fromEvent<number>('disconnectedInQueueFour')
  }

  /**
   * Distributes wether server is online or not
   * @date 2023-02-02 - 15:32:47
   * @author Christopher Reineborn
   *
   * @returns {*}
   */
  getOnlineCheck(){
    return this.socket.fromEvent<boolean>('online');
  }
  
  /**
   * Distributes the queue numbers.
   * @date 2/15/2023 - 2:49:19 PM
   * @author Christopher Reineborn
   *
   * @returns {*}
   */
  getQueueNumbers(){
    return this.socket.fromEvent('queueNumbers');
  }

  getEndOfGame(){
    return this.socket.fromEvent<boolean>('endOfGame');
  }
}


