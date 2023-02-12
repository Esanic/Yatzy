import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {

  constructor(private _router: Router) {
  //   _router.events.forEach((event) => {
  //     if(event instanceof NavigationStart) {
  //       if (event.navigationTrigger === 'popstate') {
  //         _router.navigate([''], {skipLocationChange: true})
  //       }
  //     }
  //   });
   }
}
