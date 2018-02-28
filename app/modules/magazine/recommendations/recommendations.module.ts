import {Component, OnInit, Injector} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig, RouteParams } from 'angular2/router';
import {NavRightComponent} from "../../../components/magazine/mag-nav-right/mag-nav-right.component";
import {MagRecommendationsImgModule} from "../mag-recommendations-img/mag-recommendations-img";
import {MagRecommendationsTextModule} from "../mag-recommendations-text/mag-recommendations-text";
import {NavLeftComponent} from "../../../components/magazine/mag-nav-left/mag-nav-left.component";
import {MagazinePage} from "../../../app-webpage/magazine.webpage";
import {MagazineDataService} from "../../../global/global-mag-service";
import {MagRecommendations} from "../../../global/global-interface";
import {WebApp} from "../../../app-layout/app.layout";
import {Injectable} from "angular2/core";

declare var jQuery:any;

@Component({
    selector: 'recommendations-module',
    templateUrl: './app/modules/magazine/recommendations/recommendations.module.html',

    directives: [NavRightComponent, MagRecommendationsImgModule, MagRecommendationsTextModule, NavLeftComponent, ROUTER_DIRECTIVES],
})

@Injectable()

export class Recommendations implements OnInit {
    address:string;
    magRecommendations:MagRecommendations;

    constructor(private _magazineDataService:MagazineDataService) {
        // Scroll page to top to fix routerLink bug
        window.scrollTo(0, 0);
    }

    getMagazineSimilarListings() {
        this._magazineDataService.getMagazineData(this.address)
            .subscribe(
                magData => {
                    this.magRecommendations = magData.recommendations;
                },
                err => console.log("error in getData", err)
            )
    }

    ngOnInit() {
        jQuery('body').css("min-width", "0px");
        this.getMagazineSimilarListings();
        if (document.getElementById('tabs').classList.contains('active')) {
            document.getElementById('tabs').classList.remove('active');
        }
    }
}