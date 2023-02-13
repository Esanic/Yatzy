import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private sound: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() { }
  
  setSound(sound: boolean){
    this.sound.next(sound);
  }

  getSound(): Observable<boolean> {
    return this.sound.asObservable();
  }
}
