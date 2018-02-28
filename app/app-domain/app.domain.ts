import {Component} from 'angular2/core';
import {Router, RouteData, RouteConfig, ROUTER_DIRECTIVES, LocationStrategy} from 'angular2/router';

import {WebApp} from "../app-layout/app.layout";
import {MyWebApp} from "../app-layout/app.mylayout";

@Component({
    selector: 'app-domain',
    templateUrl: './app/app-domain/app.domain.html',
    directives: [MyWebApp, WebApp, ROUTER_DIRECTIVES],
    providers: []
})

@RouteConfig([
    {
        path: '/...',
        name: 'Default-home',
        component: WebApp,
        useAsDefault: true
    },
    {
        path: '/:partner_id/...',
        name: 'Partner-home',
        component: MyWebApp,
    },
])

export class AppDomain {
    cityStateLocation: string = "WICHITA_KS";
    constructor(){
      var hostname = window.location.hostname;
      var domain = /joyfulhome/.test(hostname);
      var getClickyScript = document.createElement("script");
      var runClickyScript = document.createElement("script");
      // var noscriptClicky = document.createElement("noscript");
      if(domain){
        getClickyScript.type = "text/javascript";
        getClickyScript.src="//static.getclicky.com/js";

        runClickyScript.type = "text/javascript";
        runClickyScript.innerHTML = "try{ clicky.init(100863245); }catch(e){}";

        // noscriptClicky.innerHTML = "<p><img alt='Clicky' width='1' height='1' src='//in.getclicky.com/100863245ns.gif' /></p>";

        document.head.appendChild(getClickyScript);
        document.head.appendChild(runClickyScript);
        // document.head.appendChild(noscriptClicky);
      }
    }
}
