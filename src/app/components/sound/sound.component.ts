import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-sound',
  templateUrl: './sound.component.html',
  styleUrls: ['./sound.component.css']
})
export class SoundComponent implements OnInit {
  sound: boolean = true;

  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
    localStorage.getItem('sound') === 'true' ? this.enableSound() : this.muteSound();
  }

  muteSound(){
    this.sound = false;
    this.clientService.setSound(false);
    localStorage.setItem('sound', 'false')
  }

  enableSound(){
    this.sound = true;
    this.clientService.setSound(true);
    localStorage.setItem('sound', 'true')
  }

}
