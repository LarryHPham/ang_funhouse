import {Component, OnInit} from 'angular2/core';
import {MagNeighborhoodModule} from "../mag-neighborhood/mag-neighborhood.module";
import {NavRightComponent} from "../../../components/magazine/mag-nav-right/mag-nav-right.component";
import {MagMapModule} from "../mag-map/mag-map.module";
import {NavLeftComponent} from "../../../components/magazine/mag-nav-left/mag-nav-left.component";

@Component({
    selector: 'neighborhood-module',
    templateUrl: './app/modules/magazine/neighborhood/neighborhood.module.html',
    
    directives: [MagNeighborhoodModule, NavRightComponent, MagMapModule, NavLeftComponent],
    providers: [],
})

export class Neighborhood {
}