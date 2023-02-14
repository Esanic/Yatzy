import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { version } from './global/version';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Yatzy App';
  version = version;

  constructor(translate: TranslateService){
    translate.setDefaultLang('sv');
    translate.use('sv');
  }
}
