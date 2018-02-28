import {Component, OnInit, Injector, Input} from 'angular2/core';
import {MagazinePage} from "../../../app-webpage/magazine.webpage";
import {MagOverview} from "../../../global/global-interface";
import {MagazineDataService} from "../../../global/global-mag-service";

declare var jQuery:any;

@Component({
    selector: 'magazine-carousel-module',
    templateUrl: './app/modules/magazine/mag-carousel/mag-carousel.module.html',
    
})
export class MagCarouselModule implements OnInit {
    @Input() magOverview:MagOverview;
    length:number;
    counter:number;
    left:number;
    right:number;
    address:string;
    imageLength:number;

    constructor(private _injector:Injector) {
        // Scroll page to top to fix routerLink bug
        window.scrollTo(0, 0);
        this.address = _injector.get(MagazinePage).address;
    }

    nextClick() {
        this.left = this.counter;
        this.counter = (this.counter + 1) % this.length;
        this.right = (this.counter + 1) % this.length;
    }

    prevClick() {
        this.right = this.counter;
        this.counter = (((this.counter - 1) % this.length) + this.length) % this.length;
        this.left = (((this.counter - 1) % this.length) + this.length) % this.length;
    }

    changeClick(i) {
        if (i >= 0) {
            this.counter = i % this.length;
            this.right = (this.counter + 1) % this.length;
            this.left = (((this.counter - 1) % this.length) + this.length) % this.length;
        } else {
            this.counter = this.length - 1;
            this.right = 0;
            this.left = this.length - 2;
        }
    }

    setupImages() {
        if (this.magOverview) {
            this.length = this.magOverview.photos.length;
            this.counter = 0;
            this.right = this.counter + 1;
            this.left = this.length - 1;
            this.imageLength = this.length;
            if (this.length > 175) {
                jQuery('.mag_container').css('height', '55vw');
            }
        }
    }

    ngOnInit() {
        this.counter = 0;
        this.setupImages();
    }

    ngOnChanges() {
        this.setupImages();
    }
}
