import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {
  private participant = new Subject<string>();
  private disableButton = new Subject<boolean>();

  constructor() { }

  public setParticipant(participant: string): void {
    this.participant.next(participant);
  }

  public getParticipant(): Observable<string>{
    return this.participant.asObservable();
  }

  public setDisableAddPlayers(disableButton: boolean): void {
    this.disableButton.next(disableButton);
  }

  public getDisableAddPlayers(): Observable<boolean> {
    return this.disableButton.asObservable();
  }
}
