/**
 * Created by Christopher Lynch on 2/23/2016.
 */

import {Component} from 'angular2/core';
import {Injector} from "angular2/core";
import {MagazineDataService} from "../../../global/global-mag-service";
import {MagazinePage} from "../../../app-webpage/magazine.webpage";
import {ROUTER_DIRECTIVES} from "angular2/router";

@Component({
    selector: 'close-component',
    templateUrl: './app/components/magazine/mag-close/mag-close.component.html',
    
    directives: [ROUTER_DIRECTIVES]
})


export class CloseComponent{
    address: string;

    constructor(private _injector:Injector, private _magazineDataService:MagazineDataService) {
        this.address = _injector.get(MagazinePage).address;
    }
}