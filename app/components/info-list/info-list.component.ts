import {Component, OnInit, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from "angular2/router";
import {GlobalFunctions} from "../../global/global-functions";

@Component({
    selector: 'info-list',
    templateUrl: './app/components/info-list/info-list.component.html',
    
    directives: [ROUTER_DIRECTIVES],
    providers: [],
    inputs: ['infoList'],
})

export class InfoListComponent implements OnInit{
    buttonName: string;
    infoList: any;
    locationURL: string;

    constructor(private _globalFunctions: GlobalFunctions) {}

    ngOnInit(){
        this.locationURL = this._globalFunctions.toLowerKebab(this.infoList.city) + '-' + this.infoList.stateOrProvince.toLowerCase();
    }
}
