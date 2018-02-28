import {Component, OnInit, Input, OnChanges} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';

import {moduleHeader} from '../../components/module-header/module-header';
import {TilesComponent} from '../../components/tiles/tiles.component';
import {FeatureComponent} from '../../components/feature-list/feature-list.component';
import {FeaturedListInterface} from '../../global/global-interface';
import {GlobalFunctions} from '../../global/global-functions';
import {listViewPage} from '../../global/global-service';


@Component({
    selector: 'featured-lists-module',
    templateUrl: './app/modules/featured_lists/featured_lists.module.html',

    directives: [moduleHeader, TilesComponent, FeatureComponent],
    providers: [listViewPage],
    inputs:[]
})

export class FeaturedListsModule implements OnInit{
    public listName:string;
    public profileType: string;
    public moduleTitle: string;
    public tileData: Object;
    public listData: Object;
    public index: number = 1;
    @Input() featuredListData: any;
    @Input() addressObject: any;

    constructor(private router: Router, private _params: RouteParams, private globalFunctions: GlobalFunctions, private listService: listViewPage){
        //Determine what page the profile header module is on
        this.profileType = this.router.hostComponent.name;
    }

    left(){
        if(this.featuredListData === null){
            return false;
        }
        var max = this.featuredListData.listData[0].totalListings;
        if(this.index > 1){
            this.index -= 1;
            this.transformData();
        }else{
            this.index = max;
            this.transformData();
        }
        this.getFeaturedListings();
    }

    right(){
        if(this.featuredListData === null){
            return false;
        }
        var max = this.featuredListData.listData[0].totalListings;
        if(this.index < max){
            this.index += 1;
            this.transformData();
        }else{
            this.index = 1;
            this.transformData();
        }
        this.getFeaturedListings();
    }

    getFeaturedListings(){
      // getListData(listname, state, city, limit, page, sort)
        this.listService.getListData(this.listName, this.addressObject['state'].toUpperCase(), this.globalFunctions.toTitleCase(this.addressObject['city']), 1, this.index, null)
            .subscribe(
                data => {
                    this.featuredListData.listData = data.data;
                    this.featuredListData.listName = this.listName;
                    this.transformData();
                },
                err => console.log('Error - Feature Lists Data: ', err)
            )
    }

    //Initialization Call
    ngOnInit(){}

    transformData(){
        var data = this.featuredListData;
        if ( data === undefined || data === null ) {
          return;
        }
        // Exit function if no list data is found
        // if(data.listData.length === 0){
        //     return false;
        // }
        var listData = data.listData[0];
        //Build heading 2 description
        //Disabled until component can handle empty values for descriptions
        //if((listData.numBedrooms === null || listData.numBedrooms === '0') && (listData.numBathrooms === null || listData.numBedrooms === '0')){
        //    //No bedrooms or bathrooms defined
        //    var heading2 = '';
        //}else if((listData.numBedrooms !== null && listData.numBedrooms !== '0') && (listData.numBathrooms === null || listData.numBathrooms === '0')){
        //    //Bedrooms defined, bathrooms undefined
        //    var heading2 = 'Bedrooms: ' + listData.numBedrooms;
        //}else if((listData.numBedrooms === null || listData.numBedrooms === '0') && (listData.numBathrooms !== null && listData.numBathrooms !== '0')){
        //    //Bedrooms undefined, bathrooms defined
        //    var heading2 = 'Bathrooms: ' + listData.numBathrooms;
        //}else if((listData.numBedrooms !== null && listData.numBedrooms !== '0') && (listData.numBathrooms !== null && listData.numBathrooms !== '0')){
        //    //Bedrooms and bathrooms defined
        //    var heading2 = 'Bedrooms: ' + listData.numBedrooms + ' | Bathrooms: ' + listData.numBathrooms;
        //}
        var heading2 = 'Bedrooms: ' + listData.numBedrooms + ' | Bathrooms: ' + listData.numBathrooms;
        var city = this.globalFunctions.toTitleCase(listData.city);
        var stateAP = this.globalFunctions.stateToAP(listData.stateOrProvince);
        if(this.profileType === 'LocationPage'){
            this.moduleTitle = 'Featured Lists for ' + city + ', ' + stateAP;
        }else if(this.profileType === 'ProfilePage'){
            this.moduleTitle = 'Featured List for ' + this.addressObject.address + ', ' + this.addressObject.city + ', ' + this.addressObject.stateAP;
        }
        this.listName = data.listName;
        var paramCity = this.globalFunctions.toLowerKebab(listData.city);
        var paramState = this.globalFunctions.toLowerKebab(listData.stateOrProvince);
        //Used for both location and listing profile
        this.listData = {
            rank: this.index,
            header: 'Trending Real Estate',
            title: this.globalFunctions.convertListName(data.listName),
            hding1: this.globalFunctions.toTitleCase(listData.fullStreetAddress),
            hding2: city + ', ' + listData.stateOrProvince + ' ' + listData.postalCode,
            detail1: heading2,
            detail2: listData.listPrice === null ? '' : 'Asking Price: ',
            detail3: this.globalFunctions.formatPriceNumber(listData.listPrice),
            imageUrl: listData.photos.length === 0 ? null : listData.photos[0],
            ListUrl: 'List-page',
            listParam: {
              viewType: 'list',
              listname: this.globalFunctions.camelCaseToKababCase(data.listName),
              state: paramState,
              city: paramCity,
              page: '1',
            },
            listingUrl1: '../../Magazine',
            listingParam: {addr: listData.addressKey},
            listingUrl2: 'PropertyOverview',
        }

        //get tiles data
        this.tileData = {
            button_txt: 'Open Page',
            title1: 'Real Estate Trending List',
            icon1: 'fa-list-ul',
            desc1: '',
            url1: 'List-page',
            paramOptions1: {
                viewType: 'list',
              listname: this.globalFunctions.camelCaseToKababCase(data.listName),
              state: paramState,
              city: paramCity,
              page: '1',
            },
            title2: 'Top City Lists',
            icon2: 'fa-trophy',
            desc2: '',
            url2: 'List-of-lists-page',
            paramOptions2: {
              state: paramState,
              city: paramCity,
            },
            title3: 'Similar Statewide Lists',
            icon3: 'fa-th-large',
            desc3: '',
            url3: 'List-of-lists-page-state',
            paramOptions3: {
              state: paramState
            },
        }
    }

    //On Change Call
    ngOnChanges(event){
        //Get changed input
        if(typeof event.featuredListData != 'undefined'){
          var currentFeaturedListData = event.featuredListData.currentValue;
          //If the data input is valid run transform data function
          if(currentFeaturedListData !== null && currentFeaturedListData !== false) {
            //Perform try catch to make sure module doesnt break page
            try{
              //If featured list data has no list data (length of 0) throw error to hide module
              if(this.featuredListData.listData.length === 0){
                throw 'No Data available for featured list - hiding module';
              }
              this.transformData();
            }catch(e){
              console.log('Error - Featured List Module ', e);
              this.featuredListData = undefined;
            }//end of
          }//end of null check
        }//end of event check
    }
}
