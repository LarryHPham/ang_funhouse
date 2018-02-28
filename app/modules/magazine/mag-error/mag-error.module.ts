import {Component, Injector} from 'angular2/core';
import {ROUTER_DIRECTIVES} from "angular2/router";
import {MagazinePage} from "../../../app-webpage/magazine.webpage";
import {MagazineDataService} from "../../../global/global-mag-service";

@Component({
    selector: 'magazine-error-module',
    templateUrl: './app/modules/magazine/mag-error/mag-error.module.html',
    
    directives: [ROUTER_DIRECTIVES],
})
export class MagErrorModule {
    address: string;

    constructor(private _injector:Injector) {
        this.address = _injector.get(MagazinePage).address;
    }
}