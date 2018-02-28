import {Component, OnInit, Injector} from 'angular2/core';
import {MagExploreModule} from "../mag-explore/mag-explore.module";
import {NavLeftComponent} from "../../../components/magazine/mag-nav-left/mag-nav-left.component";
import {MagRecommendations} from "../../../global/global-interface";
import {MagazinePage} from "../../../app-webpage/magazine.webpage";
import {MagazineDataService} from "../../../global/global-mag-service";
import {MagContact} from "../../../global/global-interface";
import {ContactComponent} from "../../../components/magazine/mag-btns/contact-btn/contact-btn.component";

@Component({
    selector: 'contact-module',
    templateUrl: './app/modules/magazine/contact/contact.module.html',
    
    directives: [MagExploreModule, NavLeftComponent, ContactComponent]
})

export class Contact implements OnInit {
    address:string;
    magContact:MagContact;

    constructor(private _injector:Injector, private _magazineDataService:MagazineDataService) {
        // Scroll page to top to fix routerLink bug
        window.scrollTo(0, 0);
        this.address = _injector.get(MagazinePage).address;
    }

    getMagazineContact() {
        this._magazineDataService.getMagazineData(this.address)
            .subscribe(
                magData => {
                    this.magContact = magData.contact;
                },
                err => console.log("error in getData", err)
            )
    }

    ngOnInit() {
        this.getMagazineContact();
        if (document.getElementById('tabs').classList.contains('active')) {
            document.getElementById('tabs').classList.remove('active');
        }
    }
}