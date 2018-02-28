/**
 * Created by Christopher Lynch on 2/24/2016.
 */

import {Component, Input} from 'angular2/core';
import {Router} from "angular2/router";

@Component({
    selector: 'mag-footer-component',
    templateUrl: './app/components/magazine/mag-footer/mag-footer.component.html',
    
    directives: []
})


export class FooterComponent {
    @Input() toc: any;
    pageCount: number = 1;
    currentRouteName: any;
    currentPageNumber: number;

    constructor(public router: Router){
        //console.log( "router!!!", this.router);
    }

    ngOnChanges(event){
        if( event.toc.currentValue !== undefined ) {
            //console.log("OnChange Event", event.toc.currentValue);
            //console.log("Footer OnChange toc:!!!!", this.toc);
            this.pageCount = this.toc.length;
            this.currentPageNumber = 1;
            //console.log(this.pageCount);
        }
    }
}