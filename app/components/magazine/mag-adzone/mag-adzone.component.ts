/**
 * Created by Christopher Lynch on 2/24/2016.
 */

import {Component, OnInit} from 'angular2/core';
declare var jQuery:any;

@Component({
    selector: 'adzone-component',
    templateUrl: './app/components/magazine/mag-adzone/mag-adzone.component.html',
    directives: [],
})

export class AdzoneComponent implements OnInit {
    squareAd:boolean = false;
    src:string;
    height:string;
    width:string;

    onResize(event) {
        setTimeout(() => {
            if ((jQuery(window).width() > 1200 && jQuery(window).width() < 1474) || (jQuery(window).width() > 500 && jQuery(window).width() < 649)) {
                this.src = "/app/ads/magAd2.html"
                this.height = "60px";
                this.width = "468px"
            } else {
                this.src = "/app/ads/magAd1.html"
                this.height = "250px";
                this.width = "300px"
            }
        }, 100);
    }

    displayAd() {
        if ((jQuery(window).width() > 1200 && jQuery(window).width() < 1474) || (jQuery(window).width() > 500 && jQuery(window).width() < 649)) {
            this.src = "/app/ads/magAd2.html"
            this.height = "60px";
            this.width = "468px"
        } else {
            this.src = "/app/ads/magAd1.html"
            this.height = "250px";
            this.width = "300px"
        }
    }

    ngOnInit() {
        this.displayAd();
    }
}