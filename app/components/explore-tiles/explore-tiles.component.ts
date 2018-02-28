import {Component, Input} from 'angular2/core';
import {ExploreButtonComponent} from "../buttons/explore-button/explore-button.component";
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'explore-tiles-component',
    templateUrl: './app/components/explore-tiles/explore-tiles.component.html',
    
    directives: [ROUTER_DIRECTIVES, ExploreButtonComponent],
    providers: [],
    inputs: ['nearByCities'],
})

export class ExploreTilesComponent{
    nearByCities: Object;
}