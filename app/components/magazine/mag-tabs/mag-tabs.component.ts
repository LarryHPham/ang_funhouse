/**
 * Created by Christopher Lynch on 2/23/2016.
 */
import {Component, OnInit, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteParams} from "angular2/router";

declare var jQuery:any;

@Component({
    selector: 'magtab-component',
    templateUrl: './app/components/magazine/mag-tabs/mag-tabs.component.html',

    directives: [MagTabComponent, ROUTER_DIRECTIVES]
})
export class MagTabComponent implements OnInit {
    @Input() toc:any;
    tabIndex:[{
        label: string;
        routeName: string;
    }];
    address:string;
    selectedItem:any;

    constructor(private _params:RouteParams) {
        // Scroll page to top to fix routerLink bug
        window.scrollTo(0, 0);
        this.address = _params.get('addr');
    }

    selectItem(selectedItem) {
        if (!jQuery("#"+selectedItem.routeName).hasClass("router-link-active")) {
            jQuery(".router-link-active").removeClass("router-link-active");
        }
        this.selectedItem = selectedItem;
    }

    ngOnInit() {

    }
}
