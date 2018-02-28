import {Component, OnInit, Injector} from 'angular2/core'
import {NavLeftComponent} from "../../../components/magazine/mag-nav-left/mag-nav-left.component";
import {NavRightComponent} from "../../../components/magazine/mag-nav-right/mag-nav-right.component";
import {MagazinePage} from "../../../app-webpage/magazine.webpage";
import {MagazineDataService} from "../../../global/global-mag-service";
import {MagAmenities} from "../../../global/global-interface";
import {MagAmenitiesTextModule} from "../mag-amenities-text/mag-amenities-text.module";

@Component({
    selector: 'amenities-module',
    templateUrl: './app/modules/magazine/mag-amenities/mag-amenities.module.html',
    
    directives: [NavRightComponent, NavLeftComponent, MagAmenitiesTextModule],
})

export class Amenities implements OnInit {
    address: string;
    magAmenities:MagAmenities;
    hasImage: boolean = false;
    imageUrl: string;

    constructor( private _injector: Injector, private _magazineDataService: MagazineDataService ) {
        // Scroll page to top to fix routerLink bug
        window.scrollTo(0, 0);
        this.address = _injector.get(MagazinePage).address;
    }

    getMagazineSimilarListings() {
        this._magazineDataService.getMagazineData(this.address)
            .subscribe(
                magData => {
                    this.magAmenities = magData.amenities;
                },
                err => console.log("error in getData", err)
            )
    }

    ngOnInit() {
        this.getMagazineSimilarListings();
        if (document.getElementById('tabs').classList.contains('active')) {
            document.getElementById('tabs').classList.remove('active');
        }
    }
}