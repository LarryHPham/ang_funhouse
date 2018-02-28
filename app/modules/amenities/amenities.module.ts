/**
 * Created by Victoria on 3/10/2016.
 */
import {Component, OnInit, Input, OnChanges} from 'angular2/core';
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';

import {moduleHeader} from '../../components/module-header/module-header';
import {TilesComponent} from '../../components/tiles/tiles.component';
import {AmenitiesComponent} from '../../components/amenities/amenities.component';
import {AmenitiesNearListingInterface} from '../../global/global-interface';
import {GlobalFunctions} from '../../global/global-functions';

@Component({
    selector: 'amenities-module',
    templateUrl: './app/modules/amenities/amenities.module.html',

    directives: [moduleHeader, TilesComponent, AmenitiesComponent, ROUTER_DIRECTIVES],
    inputs:['locData']
})
export class AmenitiesModule implements OnInit{
    public locData: any;
    public hasFooterButton: boolean;
    public moduleTitle: string;
    public profileType: string;

    public listData: Object;
    public tileData: Object;
    public index: number = 0;

    providerLogo = '/app/public/amenities_yelp.png';
    providerUrl = 'http://www.yelp.com/';

    @Input() amenitiesData: any;
    @Input() addressObject: any;
    constructor(private router: Router, private _params: RouteParams, private globalFunctions: GlobalFunctions){
        //Determine what page the profile header module is on
        this.profileType = this.router.hostComponent.name;
    }


    left(){
        if(this.amenitiesData === null){
            return false;
        }
        var data = this.amenitiesData;
        var dataLists = data['restaurant']['businesses'];
        var max = dataLists.length - 1;

        if(this.index > 0){
            this.index -= 1;
            this.dataFormatter();
        }else{
            this.index = max;
            this.dataFormatter();
        }
    }
    right(){
        if(this.amenitiesData === null){
            return false;
        }
        var data = this.amenitiesData;
        var dataLists = data['restaurant']['businesses'];
        var max = dataLists.length - 1;
        if(this.index < max){
            this.index += 1;
            this.dataFormatter();
        }else{
            this.index = 0;
            this.dataFormatter();
        }
    }

    dataFormatter(){
      var data = this.amenitiesData;
      if(data.restaurant.length === 0){
          return false;
      }
      var dataLists = data['restaurant']['businesses'];
      var listData = dataLists[this.index];
      var loc = listData['location']['city'] + ', ' + listData['location']['state_code'] + ' ' + listData['location']['postal_code'];
      var address = listData['location']['address'];
      var imageURL = dataLists[this.index].image_url;
      if(this.profileType === 'LocationPage'){
          var city = this.locData.city;
          var stateAP = this.locData.stateAP;
          this.moduleTitle = 'Amenities in and Around ' + city + ', ' + stateAP;
      }else if(this.profileType === 'ProfilePage'){
          var city = this.addressObject.city;
          var stateAP = this.addressObject.stateAP;
          this.moduleTitle = 'Amenities in and Around ' + this.addressObject.address + ', ' + city + ', ' + stateAP;
      }
      var paramCity = this.globalFunctions.toLowerKebab(listData['location'].city);
      var paramState = this.globalFunctions.toLowerKebab(listData['location'].state_code);
      this.listData = {
        hasHoverNoSubImg: true,
        header: "What Restaurants Are in the Area?",
        name: loc,
        establishment: listData.name,
        imageUrl: listData.image_url,
        address: address[0] + ', ',
        location:  loc,
        originalUrl: listData.url,
        url: 'Amenities-lists-page',//for the see the list button
        paramOptions:
                  {
                    listname: 'restaurant',
                    city: paramCity,
                    state: paramState
                  },
        listView: [//data for amenities component tiles
            {
              icons: 'fa-cutlery',
              category: "Restaurants",
              count: data['restaurant'].total + " near this listing",
              url: 'Amenities-lists-page',
              paramOptions:
                        {
                          listname: 'restaurant',
                          city: paramCity,
                          state: paramState
                        },
              viewMore: "See All"
            },
            {
              icons: 'fa-shopping-cart',
              category: "Groceries Stores",
              count: data['grocers'].total + " near this listing",
              url: 'Amenities-lists-page',
              paramOptions:
                        {
                          listname: 'grocers',
                          city: paramCity,
                          state: paramState
                        },
              viewMore: "See All"
            },
            {
              icons: 'fa-dollar',
              category: "Banks",
              count: data['banks'].total + " near this listing",
              url: 'Amenities-lists-page',
              paramOptions:
                        {
                          listname: 'banks',
                          city: paramCity,
                          state: paramState
                        },
              viewMore: "See All"
            }
          ]
      }//end data for listData
      // get data for tiles
      this.tileData = {
          button_txt: 'Open Page',
          url1: 'Amenities-lists-page',
          paramOptions1: {
                      listname: 'restaurant',
                      city: paramCity,
                      state: paramState
                    },
          icon1: 'fa-cutlery',
          title1: 'Nearby Restaurants',
          desc1: '',

          url2: 'Amenities-lists-page',
          paramOptions2: {
                      listname: 'grocers',
                      city: paramCity,
                      state: paramState
                    },
          icon2: 'fa-shopping-cart',
          title2: 'Nearby Groceries',
          desc2: '',

          url3: 'Amenities-lists-page',
          paramOptions3: {
                      listname: 'banks',
                      city: paramCity,
                      state: paramState
                    },
          icon3: 'fa-dollar',
          title3: 'Nearby Banks',
          desc3: ''
      }
    }

    ngOnInit(){
        this.hasFooterButton = false;
    }
    //On Change Call
    ngOnChanges(event){
      if(typeof event.amenitiesData != 'undefined'){
        //Get changed input
        var currentAmenitiesData = event.amenitiesData.currentValue;
        //If the data input is valid run transform data function
        if(currentAmenitiesData !== null && currentAmenitiesData !== false) {
          // Perform try catch to make sure module doesnt break page
          try{
            //If featured list data has no list data (length of 0) throw error to hide module
            if(this.amenitiesData.restaurant.businesses.length === 0){
              throw 'No Data available for Amenities list - hiding module';
            }
            this.dataFormatter();
          }catch(e){
            console.log('Error - Amenities List Module ', e);
            this.amenitiesData = undefined;
          }
          //this.dataFormatter();
        }//end off null check
      }//end of event check
    }
}
