import {Component, OnInit, Input} from 'angular2/core';
import {moduleHeader} from "../../components/module-header/module-header";
import {RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {ElementRef} from "angular2/core";
import {GlobalFunctions} from "../../global/global-functions";

declare var jQuery:any;

@Component({
    selector: 'mag-module',
    templateUrl: './app/modules/mag_module/mag_module.html',

    directives: [moduleHeader, ROUTER_DIRECTIVES],
    providers: [],
    inputs:['listingData', 'magImg']
})

export class magazineModule {
  module_title:string = "Property Listing Digital Story";
  magImg:string = "/app/public/mag_module_bg.png";
  listingData: any;
  showMagazine: boolean = false; //will only show if it is a residential listing
    paramAddress: string;
  data: any;

    constructor(private _globalFunctions: GlobalFunctions, private _params:RouteParams){
        this.paramAddress = this._params.get('address');
    }
    getData(){
        var address:string;
        var addrParam:string;
        var self = this;
        if(this.listingData['propertyType'] === "Residential"){
            this.showMagazine = true;
        }

        this.magImg = this.listingData['listingImage'];
        //This is needed for IE.
        setTimeout(() => {
            jQuery('.module-wrapper').css("background", 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.75)), url(' + this.magImg + ')');
        }, 100);
        //end

        address = this.listingData.address + ', ' + this.listingData.city + ', ' + this.listingData.stateAP;
        addrParam = this.listingData.address + ' ' + this.listingData.city + ' ' + this.listingData.state;

        this.data = {
            address: address,
            url1: '../../Magazine',
            param: {addr: self.paramAddress},
            url2: 'PropertyOverview',
        }
    }

    ngOnInit() {
      this.getData();
    }
}
