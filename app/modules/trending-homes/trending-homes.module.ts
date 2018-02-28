import {Component, OnInit, Input, OnChanges} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {moduleHeader} from "../../components/module-header/module-header";
import {MediaImages} from "../../components/media-images/media-images.component";
import {GlobalFunctions} from '../../global/global-functions';
import {PropertyListingInterface} from '../../global/global-interface';
import {ListViewCarousel} from '../../components/carousel/list-view/list-view.component';
import {listViewPage} from '../../global/global-service';
declare var moment: any;

@Component({
    selector: 'trending-homes',
    templateUrl: './app/modules/trending-homes/trending-homes.module.html',
    directives: [ListViewCarousel, moduleHeader, MediaImages],
    providers: [listViewPage],
    inputs:['locData']
})

export class TrendingHomes implements OnInit {
    public locData:any;
    public moduleTitle: string;
    public profileType: string;
    public trending: boolean;
    public counter: number = 1;
    private locCity: string;
    private locState: string;
    private listName: string;
    carouselData: any = [];
    listData:any = [];
    headerData: any;
    expand:boolean = false;
    data: any;
    modal:boolean = true;
    public index: number = 0;
    @Input() trendingHomesData: any;
    @Input() addressObject: any;
    image_url:string ='/app/public/no_photo_images/onError.png';

    constructor(private router: Router, private _params: RouteParams, private globalFunctions: GlobalFunctions, private listService: listViewPage){
    }

    expandModal(){
      if(this.expand == true){
        this.expand = false;
      }else{
        this.expand = true;
      }
      return this.expand;
    }

    left(){
      this.counter--;
      if(this.counter < 1){
        this.counter = this.trendingHomesData['listData'][0].totalListings;
      }
      this.getTrendingListings();
      // this.listData = this.carouselData[this.counter];
    }

    right(){
      this.counter++;
      if(this.counter > this.trendingHomesData['listData'][0].totalListings){
        this.counter = 1;
      }
      this.getTrendingListings();
      // this.listData = this.carouselData[this.counter];
    }

    getTrendingListings(){
      // getListData(listname, state, city, limit, page, sort)
        this.listService.getListData(this.listName, this.addressObject['state'].toUpperCase(), this.globalFunctions.toTitleCase(this.addressObject['city']), 1, this.counter, null)
            .subscribe(
                data => {
                    this.trendingHomesData.listData = data.data;
                    this.trendingHomesData.listName = this.listName;
                    this.dataFormatter();
                },
                err => console.log('Error - Location Trending Homes Data: ', err)
            )
    }

    dataFormatter(){// TRANSFORM DATA TO PLUG INTO COMPONENTS
      //grab data for the header
      var data = this.trendingHomesData;
      //grab data for the list
      //call has changed to receive only one data instead of Array[100] keeping code for now
      var originalData = data.listData;
      if(originalData.length < 1 ){
        this.listData = false;
      }else{
        var listData = [];
        var carouselData = [];
        var globeFunc = this.globalFunctions;
        var totalLength = originalData[0].totalListings;
        var defaultImage = this.image_url;
        var counter = this.counter;
        //determine title of module
        if(this.profileType === 'LocationPage'){
            this.moduleTitle = 'Most Trending Homes In ' + this.addressObject.city + ', ' + this.addressObject.stateAP;
        }else if(this.profileType === 'ProfilePage'){
            this.moduleTitle = 'Most Trending Homes Around '  + this.addressObject.address + ', ' + this.addressObject.city + ', ' + this.addressObject.stateAP;
        }
        //Get listname
        if(typeof data.listName == 'undefined'){
          data.listName = 'Listing';
        }else{
          this.listName = data.listName;
        }
        originalData.forEach(function(val, i){
          val.listPrice = globeFunc.commaSeparateNumber(val.listPrice);
          if(val.listingDate === null || typeof val.listingDate == 'undefined') {
            val.valTitle = "Last Updated Since";
            var timeFallback = globeFunc.formatGlobalDate(val.modificationTimestamp,'dayOfWeek');
            val.listingDate = timeFallback;
              if(timeFallback === null || typeof timeFallback == 'undefined'){
                val.valTitle = "On The Market Since";
                val.listingDate = 'N/A';
              }
          }else {
            val.valTitle = "On The Market Since";
            val.listingDate = globeFunc.formatGlobalDate(val.listingDate,'dayOfWeek');
          }
          //grab featured data about listing
          if(typeof val.virtualTour == 'undefined'){
            val.virtualTour = 'N/A';
          }
          //if there is no photo put in default photo
          if(val.photos.length == 0){
            val.photos.push(defaultImage);
          }

          var carData = {
            address:val.fullStreetAddress,
            daysOnMarket: val.listingDate,
            largeImage:val.photos[0],
            price: val.listPrice,
            priceName: "SALE",
            zipCode:val.postalCode,
            city: val.city,
            state: val.stateOrProvince,
            photos:val.photos,
            locUrl1: "Location-page",
            locUrl2: {loc: globeFunc.toLowerKebab(val.city) + '-' +val.stateOrProvince.toLowerCase()},
            virtualTour: val.virtualTour,
            listName: globeFunc.convertListName(data.listName),
            totalListings: totalLength,
            rank: counter,
          }
          carData['url1'] = "../../Magazine";
          carData['url2'] = {addr:val.addressKey};
          carData['url3'] = "PropertyOverview";

          carouselData.push(carData);
        })//END of forEach
        //set to listData
        this.carouselData = carouselData;
        // this.counter = 0;
        this.listData = carouselData[0];
      }
    }//END OF TRANSFORM FUNCTION

    ngOnInit(){
        this.trending = true; // set flag to display trending button for media-images.component
    }
    //On Change Call
    ngOnChanges(event){
        //Determine what page the profile header module is on
        this.profileType = this.router.hostComponent.name;
        this.dataFormatter();
    }
}
