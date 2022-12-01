import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io'
import { Participant } from '../models/participant';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) {
  }

  participants(player: string) {
    this.socket.emit('participants', player);
  }

  onParticipants() {
    return this.socket.fromEvent('participants');
  }
}


