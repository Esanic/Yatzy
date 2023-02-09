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
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageComponent } from './components/language/language.component';


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

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    DicesComponent,
    ScoreBoardComponent,
    AddPlayersComponent,
    LandingPageComponent,
    GameComponent,
    LanguageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    SocketIoModule.forRoot(config),
    TranslateModule.forRoot({
      defaultLanguage: 'sv',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
