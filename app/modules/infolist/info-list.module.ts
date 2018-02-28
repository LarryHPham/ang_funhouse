import {Component, Input, OnInit} from 'angular2/core';
import {RouteParams} from "angular2/router";
import {moduleHeader} from "../../components/module-header/module-header";
import {moduleFooter} from "../../components/module-footer/module-footer";
import {InfoListComponent} from "../../components/info-list/info-list.component";
import {GlobalFunctions} from "../../global/global-functions";
import {PaginationFooter} from "../../components/pagination-footer/pagination-footer.component";
import {LocationProfileService} from '../../global/location-profile.service';

declare var moment: any;

@Component({
    selector: 'info-list-module',
    templateUrl: './app/modules/infolist/info-list.module.html',

    directives: [moduleHeader, moduleFooter, InfoListComponent, PaginationFooter],
    inputs: ['module_title', 'recentListingsData', 'locDisplay'],
    providers: [LocationProfileService],
})

export class InfoListModule implements OnInit {
    module_title: string;
    infoList: any;
    recentListingsData: any;
    locDisplay: string;
    data: any;
    state:string;
    city:string;
    public paginationParameters: Object;
    public index: number = 1;

    constructor(private _globalFunctions: GlobalFunctions, private _locationProfileService: LocationProfileService, private _params: RouteParams){
    }

    dataTransform() {
        var self = this;
        var counter = 1;
        var index = ((this.index - 1)*4) + 1;

        var infoData = this.recentListingsData;

        if(typeof infoData[0] != 'undefined'){//sets the city and state interface so when paginating it will have the required fields to make a datacall for getRecentListings();
          this.city = infoData[0].city;
          this.state = infoData[0].stateOrProvince;
        }

        this.recentListingsData.forEach(function(val,i) {
            // Format address to Title Case
            if(val.fullStreetAddress === null || val.fullStreetAddress == 'undefined') {
                val.fullStreetAddress = "N/A";
            }else {
                val.fullStreetAddress = self._globalFunctions.toTitleCase(val.fullStreetAddress);
            }
            // Format price
            val.listPrice = self._globalFunctions.commaSeparateNumber(val.listPrice);
            // Check for no data, if data Grab date from date/timestamp
            if(val.listingDate === null || typeof val.listingDate == 'undefined') {
              val.valTitle = "Last Updated Since";
              var timeFallback = val.modificationTimestamp;
              val.listingDate = self._globalFunctions.formatGlobalDate(timeFallback,'shortDate');
                if(timeFallback === null || typeof timeFallback == 'undefined'){
                  val.valTitle = "On The Market Since";
                  val.listingDate = 'N/A';
                }
            }else {
              val.valTitle = "On The Market Since";
              val.listingDate = self._globalFunctions.formatGlobalDate(val.listingDate,'shortDate');
            }
            // Counter for rank #
            val.counter = index++;
            // Check if even or odd for BG color class
            if(val.counter % 2 == 0) {
                val.bgClass = "even";
            }else{
                val.bgClass = "odd";
            }
            // Check for no photos
            if(val.photos.length <= 0) {
                val.photos[0] = "app/public/no_photo_images/House_1.png";
            }
            // Check for 0's on # beds and # bath, display N/A's
            if(val.numBathrooms == 0 || val.numBathrooms == 'undefined' || val.numBathrooms == null) {
                val.numBathrooms = "N/A";
            }
            if(val.numBedrooms == 0 || val.numBedrooms == 'undefined' || val.numBedrooms == null) {
                val.numBedrooms = "N/A";
            }
            // Button text
            val.buttonName = "View Your Home";
        });
    }

    dataPaginate() {
        this.data = this.recentListingsData;
        var index = this.index;
        var displayArray = [];
        for(var i = 0; i < 4; i++) {
            var listItem = this.data[i];
            if(typeof listItem === 'undefined') {
                continue;
            }
            displayArray.push(listItem);
        }
        this.infoList = displayArray;
    }


    //Function to set up parameters for pagination footer
    setPaginationParameters(){
        var data = this.recentListingsData;
        if ( data === undefined || data === null || data.length === 0 ) {
          return; // do nothing.
        }

        var max = Math.ceil(Number(data[0].totalListings) / 4);

        //Define parameters to send to pagination footer
        this.paginationParameters = {
            index: this.index,
            max: max,
            paginationType: 'module',
            viewAllPage: 'List-page',
            viewAllParams: {
              viewType: 'list',
              listname: 'listings-most-recent',
              city: this._globalFunctions.toLowerKebab(data[0].city),
              state: data[0].stateOrProvince.toLowerCase(),
              page: 1
            }
        }
    }

    getRecentListings() {
        this._locationProfileService.getRecentListings(this._globalFunctions.toTitleCase(this.city), this.state.toUpperCase(), this.index)
            .subscribe(
                recentListingsData => {
                  this.recentListingsData = recentListingsData;
                  this.dataTransform();
                  this.dataPaginate();
                },
                err => console.log(err)
            );
    }

    //Function that fires when a new index is clicked on pagination footer
    newIndex(index){
        this.index = index;
        this.getRecentListings();
    }

    ngOnInit() {
        this.module_title = 'Recent Listings for ' + this.locDisplay;
        if (typeof this.recentListingsData != 'undefined' && this.recentListingsData != null ) {
          this.setPaginationParameters();
          this.dataTransform();
          this.dataPaginate();
          return;
        }
    }
}
