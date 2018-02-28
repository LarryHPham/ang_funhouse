import {Component, Input, OnInit, Injector} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig, RouteParams } from 'angular2/router';
import {MagTabComponent} from "../../../components/magazine/mag-tabs/mag-tabs.component";
import {ShareComponent} from "../../../components/facebook-share/facebook-share.component";
import {CloseComponent} from "../../../components/magazine/mag-close/mag-close.component";
import {WebApp} from "../../../app-layout/app.layout";

declare var jQuery:any;

@Component({
    selector: 'magazine-header-module',
    templateUrl: './app/modules/magazine/mag-header/mag-header.module.html',

    directives: [MagTabComponent, ShareComponent, CloseComponent, ROUTER_DIRECTIVES],
    providers: []
})
export class MagHeaderModule {
    @Input() toc: any;
    pageNum: number = 1;
    public partnerID: string;
    isPartner: boolean;

    constructor( private _router:Router, private injector:Injector) {
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
                this.headerDisplay();
              }
          )//end of route subscribe
    }

    toggleTabs() {
        if (document.getElementById('tabs').classList.contains('active')) {
            document.getElementById('tabs').classList.remove('active');
        }
        else {
            document.getElementById('tabs').classList.add('active');
        }
    }

    headerDisplay(){
        if (this.partnerID != null){
            this.isPartner = true;
        }
    }

    ngOnInit(){

    }

    ngOnChanges(event){
        if( event.toc.currentValue !== undefined ) {
            //console.log("OnChange Event", event.toc.currentValue);
            //console.log("OnChange toc:!!!!", this.toc);
        }
    }
}
