/**
 * Created by Christopher Lynch on 2/24/2016.
 */

import {Component, OnInit, Injector} from 'angular2/core';
import {MagOverview} from "../../../../global/global-interface";
import {MagazinePage} from "../../../../app-webpage/magazine.webpage";
import {MagazineDataService} from "../../../../global/global-mag-service";
import {ROUTER_DIRECTIVES} from "angular2/router";

@Component({
    selector: 'learnmore-component',
    templateUrl: './app/components/magazine/mag-btns/learnmore-btn/learnmore-btn.component.html',
    
    directives: [ROUTER_DIRECTIVES]
})


export class LearnMoreComponent{
    address: string;
    magLink: MagOverview;

    constructor(private _injector:Injector, private _magazineDataService:MagazineDataService) {
        this.address = _injector.get(MagazinePage).address.toLowerCase();
    }

    getProfileLink() {
        this._magazineDataService.getMagazineData(this.address)
            .subscribe(
                magData => {
                    this.magLink = magData.overview;
                },
                err => console.log("error in getData", err)
            )
    }

    ngOnInit() {
        this.getProfileLink();
    }
}