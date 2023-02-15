import { PlatformLocation } from '@angular/common';
import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
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

  //Subscriptions
  private fullGame$: Subscription = new Subscription;
  private getRoom$: Subscription = new Subscription;
  private amtOfPlayers$: Subscription = new Subscription;
  private disconnectedInQueue$: Subscription = new Subscription;
  private maxPlayers$: Subscription = new Subscription;
  private subscriptions: Subscription[] = [this.amtOfPlayers$, this.disconnectedInQueue$, this.fullGame$, this.getRoom$, this.maxPlayers$]

  constructor(private socketService: SocketService, private playerService: PlayerService, private router: Router) {
    //To prevent possibility to go back and forth into game.
    router.events.forEach((event) => {
      if(event instanceof NavigationStart) {
        if (event.navigationTrigger === 'popstate') {
          router.navigate([''], {skipLocationChange: true})
        }
      }
    });
   }

   /**
    * Retrieves if the socket-room is full or not
    * Retrieves the socket-room name.
    * Retrieves both current amount of players connected to current socket-room and users chosen maxplayer limit
    * @date 2023-01-31 - 13:20:08
    * @author Christopher Reineborn
    *
    * @returns {*}
    */

  ngOnInit(): void {
    //Subscribes to chosen max players
    this.maxPlayers$ = this.playerService.getChosenMaxPlayers().subscribe(players => {
      this.maxPlayers = players;

      if(this.maxPlayers === 1){
        this.fullGame = true;
      }
    })

    //Subscribes to get when current room is full from the backend
    this.fullGame$ = this.socketService.getRoomFull().subscribe(status => {
      if(status){
        this.fullGame = true;
      }
    })

    //Subscribes to recieve number of players in the room from the backend
    this.amtOfPlayers$ = this.socketService.getAmtOfPlayersInRoom().subscribe(amtOfPlayers => {
      this.amtOfPlayers = Number(amtOfPlayers);
    })

    //Subscribes to recieve the room name from the backend.
    //Used to emit stuff to the same room socket is in.
    this.getRoom$ = this.socketService.getRoomName().subscribe(room => {
      this.socketService.setRoomName(room);
    })

    //Depending on the amount of maxPlayers, subscribes to get disconnects while in queue.
    if(this.maxPlayers === 2){
      this.disconnectedInQueue$ = this.socketService.getDisconnectedPlayerInTwoQueue().subscribe(amtOfPlayers => {
        this.amtOfPlayers = amtOfPlayers;
      })
    }
    if(this.maxPlayers === 3){
      this.disconnectedInQueue$ = this.socketService.getDisconnectedPlayerInThreeQueue().subscribe(amtOfPlayers => {
        this.amtOfPlayers = amtOfPlayers;
      })
    }
    if(this.maxPlayers === 4){
      this.disconnectedInQueue$ = this.socketService.getDisconnectedPlayerInFourQueue().subscribe(amtOfPlayers => {
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
