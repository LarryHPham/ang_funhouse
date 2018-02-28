/**
 * Created by Christopher Lynch on 2/24/2016.
 */

import {Component, Input} from 'angular2/core';
import {Router} from 'angular2/router';
import {MagazinePage} from "../../../app-webpage/magazine.webpage";

declare var jQuery:any;

@Component({
    selector: 'mag-nav-right-component',
    templateUrl: './app/components/magazine/mag-nav-right/mag-nav-right.component.html',
    directives: []
})
export class NavRightComponent {
    @Input() toc:any;
    isClicked:boolean = false;

    constructor(private _router:Router) {
    }

    clickNext() {
        let currentPageLink = jQuery("magtab-component a.router-link-active");
        let currentIndex = currentPageLink.index();
        let nextLink = currentPageLink.next("a");
        jQuery(".router-link-active").removeClass("router-link-active");
        let firstLink = jQuery("magtab-component a:first-child");
        if (!nextLink.length) {
            this._router.navigate([this.toc[0].routeName]);
            firstLink.addClass("router-link-active");
        } else {
            this._router.navigate([this.toc[currentIndex + 1].routeName]);
            nextLink.addClass("router-link-active");
        }
    }
}
