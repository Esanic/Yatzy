import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DicesComponent } from './components/dices/dices.component';
import { ScoreBoardComponent } from './components/score-board/score-board.component';
import { AddPlayersComponent } from './components/add-players/add-players.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './pages/game/game.component';


const config: SocketIoConfig = {
  url: environment.socketUrl,
  options: {
    transports: ['websocket']
  }
}

const routes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: 'game', component: GameComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    DicesComponent,
    ScoreBoardComponent,
    AddPlayersComponent,
    LandingPageComponent,
    GameComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    SocketIoModule.forRoot(config),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
