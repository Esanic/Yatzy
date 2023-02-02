import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { PlayerService } from 'src/app/services/player.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  public fullGame: boolean = false;
  public amtOfPlayers: number = 1;
  public maxPlayers: number = 0;

  private subFullGame$: Subscription = new Subscription;
  private subGetRoom$: Subscription = new Subscription;
  private subAmtOfPlayers$: Subscription = new Subscription;
  private subDisconnectedInQueue$: Subscription = new Subscription;
  private subMaxPlayers$: Subscription = new Subscription;
  private subscriptions: Subscription[] = [this.subAmtOfPlayers$, this.subDisconnectedInQueue$, this.subFullGame$, this.subGetRoom$, this.subMaxPlayers$]

  constructor(private socketService: SocketService, private playerService: PlayerService) { }


   /**
    * Retrieves if the socket-room is full or not and retrieves the socket-room name.
    * @date 2023-01-31 - 13:20:08
    * @author Christopher Reineborn
    *
    * @returns {*}
    */

  ngOnInit(): void {
    this.subMaxPlayers$ = this.playerService.getChosenMaxPlayers().subscribe(players => {
      this.maxPlayers = players;
    })

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

    if(this.maxPlayers === 2){
      this.subDisconnectedInQueue$ = this.socketService.getDisconnectedPlayerInTwoQueue().subscribe(amtOfPlayers => {
        this.amtOfPlayers = amtOfPlayers;
      })
    }
    if(this.maxPlayers === 3){
      this.subDisconnectedInQueue$ = this.socketService.getDisconnectedPlayerInThreeQueue().subscribe(amtOfPlayers => {
        this.amtOfPlayers = amtOfPlayers;
      })
    }
    if(this.maxPlayers === 4){
      this.subDisconnectedInQueue$ = this.socketService.getDisconnectedPlayerInFourQueue().subscribe(amtOfPlayers => {
        this.amtOfPlayers = amtOfPlayers;
      })
    }
  }
 
  /**
   * Unsubscribes from observables.
   * @date 2023-01-31 - 13:42:37
   * @author Christopher Reineborn
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    })
  }

}
