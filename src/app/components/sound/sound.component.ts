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

  
  /**
   * Fetches the @param sound from localestorage in order to use the users last chosen state on sound.
   * @date 2/15/2023 - 11:17:21 AM
   */
  ngOnInit(): void {
    localStorage.getItem('sound') === 'true' ? this.enableSound() : this.muteSound();
  }

  
  /**
   * Mutes the sound for all audio.
   * @date 2/15/2023 - 11:18:29 AM
   */
  muteSound(){
    this.sound = false;
    this.clientService.setSound(false);
    localStorage.setItem('sound', 'false')
  }

  
  /**
   * Enables the sound for all audio.
   * @date 2/15/2023 - 11:18:44 AM
   */
  enableSound(){
    this.sound = true;
    this.clientService.setSound(true);
    localStorage.setItem('sound', 'true')
  }

}
