import { Component, OnDestroy, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css']
})
export class LanguageComponent implements OnInit, OnDestroy {
  public languageList = [
    { code: 'sv', label: this.translate.instant('LANGUAGES.SWEDISH'), flag: 'assets/images/sweden.png'},
    { code: 'en', label: this.translate.instant('LANGUAGES.ENGLISH'), flag: 'assets/images/united-states.png'},
  ];

  private langChange$: Subscription = new Subscription();

  constructor(private translate: TranslateService) { }


  
  /**
   * Fetches the @param locale in localStorage in order to retrieve the users last chosen locale.
   * Subscribes to language change.
   * @date 2/15/2023 - 11:14:14 AM
   */
  ngOnInit(): void {
    const locale = localStorage.getItem('locale');
    locale ? this.changeSiteLanguage(locale) : null;

    this.langChange$ = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate.stream('LANGUAGES').subscribe(translation => {
        const languages: string[] = Object.keys(translation);
        for(let i = 0; i < this.languageList.length; i++){
          this.languageList[i].label = translation[languages[i]]
        }
      })
    })
  }

  
  /**
   * Unsubscribes from observable
   * @date 2/15/2023 - 11:15:14 AM
   */
  ngOnDestroy(): void {
    this.langChange$.unsubscribe();
  }

  
  /**
   * Changes the site language.
   * @date 2/15/2023 - 11:15:26 AM
   *
   * @param {string} localeCode - code used to determine what language to use.
   */
  changeSiteLanguage(localeCode: string): void {
    const selectedLanguage = this.languageList.find((language) => language.code === localeCode)?.label.toString();
    if (selectedLanguage) {
      this.translate.use(localeCode);
      localStorage.setItem('locale', localeCode);
    }
  }
}
