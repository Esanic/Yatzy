import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  public fullGame: boolean = false;

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.socketService.getRoomFull().subscribe(status => {
      if(status){
        this.fullGame = true;
        console.log(this.fullGame);
      }
    })

    this.socketService.getRoomName().subscribe(room => {
      this.socketService.setRoomName(room);
    })
    
  }

}
