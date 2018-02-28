import {Component, Input, OnInit} from 'angular2/core';
import {List} from '../../global/global-interface';
import {ROUTER_DIRECTIVES} from "angular2/router";
import {GlobalFunctions} from "../../global/global-functions";

@Component({
    selector: 'contentlist',
    templateUrl: './app/components/contentlist/contentlist.html',
    
    directives: [ROUTER_DIRECTIVES],
    providers: [GlobalFunctions],
})

export class contentList implements OnInit{
    @Input() data;
    @Input() cityLocation;
    @Input() stateLocation;
    @Input() isStateOnly;

    first: number = 0;
    location: string;
    locationURL: string;

    constructor(private _globalFunctions: GlobalFunctions) {}

    ngOnInit(){
        if(!this.isStateOnly) {
            this.cityLocation = this._globalFunctions.toLowerKebab(this.cityLocation); //make sure it's in kabab form
            this.location = this._globalFunctions.toTitleCase(this.cityLocation.replace(/-/g, " ")) + ', ' + this._globalFunctions.stateToAP(this.stateLocation);
            this.locationURL = this.cityLocation + '-' +this.stateLocation.toLowerCase();
        } else {
            this.location = this._globalFunctions.toTitleCase(this.data.listData[0].city) + ', ' + this._globalFunctions.stateToAP(this.stateLocation);
            this.locationURL = this._globalFunctions.toLowerKebab(this.data.listData[0].city) + '-' +this.stateLocation.toLowerCase();
        }
    }
}
