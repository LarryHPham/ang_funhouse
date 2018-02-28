import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from "angular2/router";
import {GlobalFunctions} from "../../global/global-functions";

@Component({
    selector: 'feature-tiles-component',
    templateUrl: './app/components/feature-tiles/feature-tiles.component.html',

    directives: [ROUTER_DIRECTIVES],
    providers: [ROUTER_DIRECTIVES],
    inputs: ['cityLocation', 'stateLocation', 'cityName'],
})

export class FeatureTilesComponent{
    location: string;
    cityLocation: string;
    stateLocation: string;

    constructor(private _globalFunctions: GlobalFunctions) {}

    ngOnInit() {
        this.location = this._globalFunctions.toLowerKebab(this.cityLocation) + '-' + this.stateLocation.toLowerCase();
    }
}
