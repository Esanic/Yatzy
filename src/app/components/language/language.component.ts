import { Component, OnDestroy, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PlayerService } from 'src/app/services/player.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css']
})
export class LanguageComponent implements OnInit, OnDestroy {
  languageList = [
    { code: 'sv', label: this.translate.instant('LANGUAGES.SWEDISH'), flag: 'assets/images/sweden.png'},
    { code: 'en', label: this.translate.instant('LANGUAGES.ENGLISH'), flag: 'assets/images/united-states.png'},
  ];

  private subLangChange$: Subscription = new Subscription();

  constructor(private translate: TranslateService, private playerService: PlayerService) { }


  ngOnInit(): void {
    this.subLangChange$ = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate.stream('LANGUAGES').subscribe(translation => {
        const languages: string[] = Object.keys(translation);
        for(let i = 0; i < this.languageList.length; i++){
          this.languageList[i].label = translation[languages[i]]
        }
      })
    })
  }

  ngOnDestroy(): void {
    this.subLangChange$.unsubscribe();
  }

  changeSiteLanguage(localeCode: string): void {
    const selectedLanguage = this.languageList
      .find((language) => language.code === localeCode)
      ?.label.toString();
    if (selectedLanguage) {
      this.translate.use(localeCode);
    }
  }

  
}
