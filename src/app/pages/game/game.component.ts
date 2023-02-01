import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  public fullGame: boolean = false;
  public amtOfPlayers: number = 1;

  private subFullGame$: Subscription = new Subscription;
  private subGetRoom$: Subscription = new Subscription;
  private subAmtOfPlayers$: Subscription = new Subscription;

  constructor(private socketService: SocketService) { }


   /**
    * Retrieves if the socket-room is full or not and retrieves the socket-room name.
    * @date 2023-01-31 - 13:20:08
    * @author Christopher Reineborn
    *
    * @returns {*}
    */

  ngOnInit(): void {
    this.subFullGame$ = this.socketService.getRoomFull().subscribe(status => {
      if(status){
        this.fullGame = true;
      }
    })

    this.subAmtOfPlayers$ = this.socketService.getAmtOfPlayersInRoom().subscribe(amtOfPlayers => {
      this.amtOfPlayers = Number(amtOfPlayers);
    })

    this.subGetRoom$ = this.socketService.getRoomName().subscribe(room => {
      this.socketService.setRoomName(room);
    })
  }
 
  /**
   * Unsubscribes from observables.
   * @date 2023-01-31 - 13:42:37
   * @author Christopher Reineborn
   */
  ngOnDestroy(): void {
    this.subFullGame$.unsubscribe();
    this.subGetRoom$.unsubscribe();
    this.subAmtOfPlayers$.unsubscribe();
  }

}
