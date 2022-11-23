import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ParticipantService } from 'src/app/services/participant.service';

@Component({
  selector: 'app-add-players',
  templateUrl: './add-players.component.html',
  styleUrls: ['./add-players.component.css']
})
export class AddPlayersComponent implements OnInit {
  public names = this.formBuilder.group({
    name: ''
  })

  public disableButton: boolean = false;

  constructor(private formBuilder: FormBuilder, private participantService: ParticipantService) { }

  ngOnInit(): void {
    this.participantService.getDisableAddPlayers().subscribe(bool => {
      this.disableButton = bool;
    })
  }

  public setName(): void {
    let name = this.names.value.name?.toString();
    name != undefined ? this.participantService.setParticipant(name) : null
    this.names.setValue({name: ""});
  }

}
