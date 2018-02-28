import {Component, OnInit, Injector, Input} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig, RouteParams } from 'angular2/router';
import {AdzoneComponent} from "../../../components/magazine/mag-adzone/mag-adzone.component";
import {LearnMoreComponent} from "../../../components/magazine/mag-btns/learnmore-btn/learnmore-btn.component";
import {MagNeighborhood} from "../../../global/global-interface";
import {MagazinePage} from "../../../app-webpage/magazine.webpage";
import {MagazineDataService} from "../../../global/global-mag-service";
import {WebApp} from "../../../app-layout/app.layout";

declare var jQuery:any;

@Component({
    selector: 'magazine-neighborhood-module',
    templateUrl: './app/modules/magazine/mag-neighborhood/mag-neighborhood.module.html',

    directives: [AdzoneComponent, LearnMoreComponent, ROUTER_DIRECTIVES],
})
export class MagNeighborhoodModule implements OnInit {
    address:string;
    magNeighborhood:MagNeighborhood;
    public partnerID:string;
    isPartner:boolean;

    constructor(private _injector:Injector, private _magazineDataService:MagazineDataService) {
        // Scroll page to top to fix routerLink bug
        window.scrollTo(0, 0);
        this.address = _injector.get(MagazinePage).address;
    }

    onResize(event) {
        setTimeout(() => {
            let fontSize = 4;
            if (jQuery(window).width() > '1020') {
                while (jQuery('.mag_text')[0].scrollHeight > jQuery('.mag_text')[0].clientHeight) {
                    jQuery('.mag_text').css('font-size', fontSize + 'vw');
                    fontSize = fontSize - 0.01;
                    if (fontSize < 0.5) {
                        console.log('Too many loops!');
                        return false;
                    }
                }
            } else {
                jQuery('.mag_text').css('font-size', '18px');
            }
        }, 100);
    }

    getMagazineNeighborhood() {
        this._magazineDataService.getMagazineData(this.address)
            .subscribe(
                magData => {
                    this.magNeighborhood = magData.neighborhood;
                },
                err => console.log("error in getData", err)
            )
    }

    ngOnInit() {
        this.getMagazineNeighborhood();
        if (document.getElementById('tabs').classList.contains('active')) {
            document.getElementById('tabs').classList.remove('active');
        }
    }
}