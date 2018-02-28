/*
 GLOBAL SERVICE INDEX

 @LOCATIONPROFILE
 _@BATCH-1
 _@BATCH
 */
import {Injectable, Injector} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig, RouteParams } from 'angular2/router';
import {MagOverview, MagData} from './global-interface';
import {HTTP_PROVIDERS, Http, Response, Headers} from "angular2/http";
import {Observable} from 'rxjs/Rx';
import {WebApp} from "../app-layout/app.layout";
import {GlobalSettings} from './global-settings';

@Injectable()

export class MagazineDataService {
    public aiUrl: string = GlobalSettings.getAiUrl();
    cachedData : MagData;
    public partnerID: string;

    constructor( private _router:Router, private _injector: Injector, public http: Http) {
      this._router.root
          .subscribe(
              route => {
                var curRoute = route;
                var partnerID = curRoute.split('/');
                if(partnerID[0] == ''){
                  this.partnerID = null;
                }else{
                  this.partnerID = partnerID[0];
                }
              }
          )//end of route subscribe
    }

    getMagazineData(address) {
        if ( this.cachedData ) {
            return Observable.of(this.cachedData);
        } else {
            if (this.partnerID == null) {
                return this.http.get(this.aiUrl + '/' + address)
                    .map(res => res.json())
                    .do((data) => {
                        this.cachedData = data;
                    });
            } else {
                return this.http.get(this.aiUrl + '/' + address + '?partner=' + this.partnerID)
                    .map(res => res.json())
                    .do((data) => {
                        this.cachedData = data;
                    });
            }
        }
    }
}
