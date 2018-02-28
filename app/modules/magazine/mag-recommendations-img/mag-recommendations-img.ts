import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from "angular2/router";

@Component({
    selector: 'magazine-recommendations-img-module',
    templateUrl: './app/modules/magazine/mag-recommendations-img/mag-recommendations-img.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [],
    inputs: ['magRecommendations', 'recommendations', 'isPartner', 'partnerID'],
})

export class MagRecommendationsImgModule{
}
