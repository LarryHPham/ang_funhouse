import {Component, OnInit, Input} from 'angular2/core';
import {RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {GlobalFunctions} from "../../global/global-functions";

@Component({
    selector: 'mag-banner-module',
    templateUrl: './app/modules/mag_banner/mag_banner.module.html',

    directives: [ROUTER_DIRECTIVES],
    providers: [],
    inputs:['listingData', 'listing']
})

export class magazineBanner {
  listingData: any;
  showMagazine: boolean = false; //will only show if it is a residential listing
  data: any;
    paramAddress: string;

  constructor(private _globalFunctions: GlobalFunctions, private _params:RouteParams){
      this.paramAddress = this._params.get('address');
  }

    ngOnInit() {
      var address:string;
      var addrParam:string;
      var dataList = this.listingData;
        var self = this;
      if(dataList['propertyType'] == 'Residential'){
        this.showMagazine = true;
      }
      address = dataList.address + ', ' + dataList.city + ', ' + dataList.stateAP;
      addrParam = dataList.address + ' ' + dataList.city + ' ' + dataList.state;
      this.data = {
          address: address,
          url1: '../../Magazine',
          param: {addr: self.paramAddress},
          url2: 'PropertyOverview',
      }
    }
}
