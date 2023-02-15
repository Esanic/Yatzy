import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private soundState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() { }
  
  /**
   * Setting the sound state to be distributed to subscribers.
   * @date 2/15/2023 - 1:24:44 PM
   * @author Christopher Reineborn
   *
   * @param {boolean} soundState - sound state to be set in the Behavior Subject
   */
  setSound(sound: boolean){
    this.soundState.next(sound);
  }

  
  /**
   * Distributes the sound state to subscribers.
   * @date 2/15/2023 - 1:26:08 PM
   * @author Christopher Reineborn
   *
   * @returns {Observable<boolean>} - An observable of the sound state
   */
  getSound(): Observable<boolean> {
    return this.soundState.asObservable();
  }
}
