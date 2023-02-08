import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css']
})
export class LanguageComponent implements OnInit {
  siteLanguage = 'Swe';
  languageList = [
    { code: 'sv', label: 'Swe', flag: 'assets/images/sweden.png'},
    { code: 'en', label: 'Eng', flag: 'assets/images/united-states.png'},
  ];

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    console.log(this.languageList);
  }

  changeSiteLanguage(localeCode: string): void {
    const selectedLanguage = this.languageList
      .find((language) => language.code === localeCode)
      ?.label.toString();
    if (selectedLanguage) {
      this.siteLanguage = selectedLanguage;
      this.translate.use(localeCode);
    }
  }
}
