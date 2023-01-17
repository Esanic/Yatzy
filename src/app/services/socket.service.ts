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

  joinRoom(player: string) {
    this.socket.emit('joinRoom', player);
  }

  diceHit(dice: Die[] ) {
    console.log(dice);
    this.socket.emit('diceHit', dice, this.roomName);
  }

  // getUserID(){
  //   return this.socket.fromEvent<string>('userID');
  // }

  getRoomName(){
   return this.socket.fromEvent<string>('roomName');
  }
  setRoomName(room: string){
    this.roomName = room;
  }

  getRoomFull(){
    return this.socket.fromEvent<boolean>('fullGame');
  }

  getPlayers() {
    return this.socket.fromEvent('players');
  }

  getDiceHit(){
    return this.socket.fromEvent<Die[]>('getDice');
  }






  


}


