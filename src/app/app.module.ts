import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DicesComponent } from './components/dices/dices.component';
import { ScoreBoardComponent } from './components/score-board/score-board.component';
import { AddPlayersComponent } from './components/modals/add-players/add-players.component';

const config: SocketIoConfig = {
  url: environment.socketUrl,
  options: {
    transports: ['websocket']
  }
}

@NgModule({
  declarations: [
    AppComponent,
    DicesComponent,
    ScoreBoardComponent,
    AddPlayersComponent,
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(config),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
