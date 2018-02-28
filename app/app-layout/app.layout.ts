import {Component} from 'angular2/core';
import {AppComponent} from "../app-webpage/app.webpage";
import {MagazinePage} from "../app-webpage/magazine.webpage";
import {GlobalFunctions} from "../global/global-functions";
import {GlobalSettings} from "../global/global-settings";
import {GeoLocation} from "../global/global-service";

import {RouteParams, Router, RouteData, RouteConfig, RouterOutlet, ROUTER_DIRECTIVES, LocationStrategy} from 'angular2/router';

@Component({
    selector: 'web-app',
    templateUrl: './app/app-layout/app.layout.html',

    directives: [MagazinePage, AppComponent,RouterOutlet, ROUTER_DIRECTIVES],
    providers: [GeoLocation, GlobalSettings, GlobalFunctions],
})

@RouteConfig([
    {
       path: '/...',
       name: 'Webpages',
       component: AppComponent,
       useAsDefault: true
    },
    {
      path: '/magazine/:addr/...',
      name: 'Magazine',
      component: MagazinePage
    },
])

export class WebApp {
  partnerID: string;
  address:string = '1324-N-Manchester-CT-Wichita-KS';
  camelCaseToRegularCase(str){// GRABBED FROM GLOBAL FUNCTION app/global/global-functions.ts
      str = str
          .replace(/([A-Z][a-z]+)/g, " $1")
          .replace(/([A-Z][A-Z]+)/g, " $1")
          .replace(/([^A-Za-z ]+)/g, " $1")
          // uppercase the first character
          .replace(/^./, function(str){ return str.toUpperCase(); })
      return str;
  }
  constructor(private _params: RouteParams, private _geoLocation: GeoLocation){
    var partnerName = this._params.get('partner_id');
    document.title = "JoyfulHome";

        //function that grabs the designated location needed for the client and if a partnerID is sent through then it will also set the partnerID and partnerScript for their Header
        if(GlobalSettings.getHomeInfo().isSubdomainPartner) {
          var hostname = window.location.hostname;
          var parnterName = window.location.hostname.split('.')[1] + '.' + window.location.hostname.split('.')[2];
          GlobalSettings.storedPartnerId(parnterName);
        } else {
          GlobalSettings.storedPartnerId(partnerName);
          this.partnerID = partnerName;
        }
  }

}
