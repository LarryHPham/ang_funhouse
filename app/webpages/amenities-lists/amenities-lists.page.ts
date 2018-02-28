/**
 * Created by Victoria on 3/14/2016.
 */
import {Component, Input, OnInit, OnChanges} from 'angular2/core';
import {RouteParams, Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {WidgetModule} from "../../modules/widget/widget.module";
import {GlobalFunctions} from "../../global/global-functions";

import {BackTabComponent} from "../../components/backtab/backtab.component";
import {moduleHeader} from "../../components/module-header/module-header";
import {HeroListComponent} from "../../components/hero/hero-list/hero-list.component";
import {LocationProfileService} from '../../global/location-profile.service';
import {LoadingComponent} from '../../components/loading/loading.component';
import {ErrorComponent} from '../../components/error/error.component';
import {TitleComponent} from '../../components/title/title.component';
import {DynamicCarousel2} from "../../components/carousel/dynamic-carousel2/dynamic-carousel2";
import {PaginationFooter} from '../../components/pagination-footer/pagination-footer.component';
import {SeoService} from "../../global/seo.service";

declare var moment: any;

@Component({
    selector: 'Amenities-list-page',
    templateUrl: './app/webpages/amenities-lists/amenities-lists.page.html',

    directives: [PaginationFooter, WidgetModule, moduleHeader, HeroListComponent, ROUTER_DIRECTIVES, LoadingComponent, BackTabComponent, ErrorComponent, TitleComponent, DynamicCarousel2],
    providers: [LocationProfileService, SeoService]
})

export class AmenitiesListPage implements OnInit{
  paramAddress: string;
  data: any;
  address: string;
  amenitiesListingsData: any;
  name: string;
  displayAddress1: string;
  displayAddress2: string;
  public displayCategory: string;
  public paramCategory: string;
  public location: string;
  public locCity: string;
  public locState: string;
  public profileType: string;
  public titleComponentData: {};
  carouselData: any = [];
  private amenitiesData: any;
  paginationParameters:Object;
  displayData: Array<any> = [];
  index:number = 0;
  arraySize: number = 10;
  providerUrl = 'http://www.yelp.com/';
  providerLogo = '/app/public/amenities_yelp.png';
  noListings: boolean = false;
  public locUrl: Object;
  @Input() amenitiesNearListingData: any;

  amenitiesDataForSeo:any;

  public isError: boolean = false;

  constructor(private _params: RouteParams, private router: Router, private globalFunctions: GlobalFunctions,  private _locationService: LocationProfileService, params: RouteParams, private _seo:SeoService){
      this.paramCategory = params.params['listname'];
      if(this.paramCategory == 'restaurant'){
        this.displayCategory = 'restaurants';
      }
      else {
        this.displayCategory = this.paramCategory;
      }
      window.scrollTo(0, 0);
  }

  getData(){
      this._locationService.getAmenitiesData(this.locCity, this.locState)
          .subscribe(
              amenitiesData => {
                this.amenitiesData = this.dataFormatter(amenitiesData);
                this.amenitiesDataForSeo = this.amenitiesData;
                this.sanitizeListofListData();
                this.createMetaTags(this.titleComponentData,this.amenitiesData);
              },
              err => {
                console.log('Error: Amenities Page API', err);
                this.isError = true;
              }
          );

  }

  dataFormatter(data){
    var counter = 1;
    if(!data) return false;
    this.titleComponentData = {
        imageURL: '/app/public/joyfulhome_house.png',
        smallText1: 'Last Updated: ' + this.globalFunctions.formatGlobalDate(new Date(),'timeZone'),
        smallText2: this.location,
        heading1: this.globalFunctions.toTitleCase(this.displayCategory) + ' in and around ' + this.location,
        icon: 'fa fa-map-marker',
        hasHover: false
   }//end data input for title component

    var dataLists = data[this.paramCategory]['businesses'];
    var globalFunc = this.globalFunctions;
    var carouselData = [];
    dataLists.forEach(function(val, i){
      val.rank = i+1;
      val.location['address'].forEach(function(addr, index) {
        if(typeof val.displayAddress1 != 'undefined'){
          val.displayAddress1 += addr + ' ';
        }else{
          val.displayAddress1 = addr + ' ';
        }
      })//end forEach to get full address
      // Counter for rank #
      val.displayAddress2 =  val['location']['city'] + ', ' + val['location']['state_code'];
      val.rank = counter++;
      // Check if even or odd for BG color class
      if(counter % 2 == 0) {
          val.bgClass = "even";
      }else{
          val.bgClass = "odd";
      }
      val.displayAddress2 =  val['location']['city'] + ', ' + val['location']['state_code'];
      val.locationUrl = {loc: globalFunc.toLowerKebab(val['location']['city']) + '-' + val['location']['state_code'].toLowerCase()};
      if(typeof val.phone == 'undefined' || val.phone === 'null'){
        val.phone = 'No Phone Listed';
      }
      val.phone = globalFunc.formatPhoneNumber(val['phone']);
      if(val.categories === 'null' || val.categories == "" || typeof val.categories == 'undefined'){
        val.categories = 'N/A';
      } else {
        val.categories = val.categories[0][0];
      }
      var carData = {
        textDetails:    [
                        val.name,
                        "<small><i class='fa fa-map-marker'></i> "+ val.displayAddress2+"</small>",
                        "&nbsp;",
                        val.categories,
                        "<small><i class='fa fa-phone-square'></i> "+val.phone+"</small>"
                        ],
        callToAction:   "Interested in discovering more about this amenity?",
        buttonLabel:    "<span></span> <span>View on Yelp</span> <i class='fa fa-angle-right'></i>",
        index:          val.rank,
        imageUrl1:      val.image_url,
        imageLocationText: "On Yelp"
      }
      carData['linkUrl1'] = val.url;
      carouselData.push(carData);
    })//end of forEach
    this.carouselData = carouselData;
    return dataLists;
  }//end dataFormatter
  sanitizeListofListData(){
      var data = this.amenitiesData;
      if (data.length <= 0) {
          this.noListings = true;
          return;
      } else {
          this.noListings = false;
      }
      var dataToArray = [];
      var size = this.arraySize;
      var sanitizedArray = [];
      var objCount = 0;
      for( var obj in data ){
        dataToArray.push(data[obj]);
      }
      var max = Math.ceil(dataToArray.length / size);
      //Run through a loop the check data and generated and obj array fill with a max of size variable
      dataToArray.forEach(function(item, index){
        if(typeof sanitizedArray[objCount] == 'undefined'){
          sanitizedArray[objCount] = [];
        }
        sanitizedArray[objCount].push(item);
          if(item !== null  && sanitizedArray[objCount].length == size){
            objCount++;
          }
      });

      //display current data that user has click on and possibly the page user has declared
      this.displayData = sanitizedArray[this.index];
      if(data != '' || data.length > 0){ //only show if there are results
        //Set up parameters for pagination display
        this.setPaginationParameters(max);
      }
  }
  //Function to set up parameters for pagination footer
  setPaginationParameters(max){
      //Define parameters to send to pagination footer
      this.paginationParameters = {
          index: this.index+1,
          max: max,
          paginationType: 'module',
          viewAllPage: 'Search-page',
      }
  }
  //Function that fires when a new index is clicked on pagination footer
  newIndex(index){
      this.index = index-1;
      this.sanitizeListofListData();
  }
  ngOnInit(){
    this.locState = decodeURI(this._params.get('state'));
    this.locCity = decodeURI(this._params.get('city')).split("-").join(" ");
    this.locUrl = {loc: this.globalFunctions.toLowerKebab(this.locCity) + '-' + this.locState.toLowerCase()};
    this.location = this.globalFunctions.toTitleCase(this.locCity) + ', ' + this.globalFunctions.stateToAP(this.locState);
    this.getData();

  }//end ngOnInit

  // On Change Call
  ngOnChanges(event) {
    //Get changed input
    var currentAmenitiesNearListingData = event.amenitiesNearListingData.currentValue;
    //If the data input is valid run transform data function
    if (currentAmenitiesNearListingData !== null && currentAmenitiesNearListingData!== false) {
      this.getData();
    }
  }//end ngOnChanges

    /* Navigates to top of page on navigation */
    routerOnDeactivate(){
        window.scrollTo(0,0);
    }

    createMetaTags(data1,data2){
        this._seo.removeMetaTags();
        var kArray = [];
        for(var i=0;i<data2.length;i++){
            let searchKey = data2[i].categories;
            let searchName = data2[i].name;
            let searchCity = data2[i].location.city;
            if(SeoService.checkData(searchKey)){
                kArray.push(searchKey);
            };
            if(SeoService.checkData(searchName)){
                kArray.push(searchName);
            };
            if(SeoService.checkData(searchCity)){
                kArray.push(searchCity);
            };


        }
        var filteredkArray = kArray.filter((item,pos)=>{
            return kArray.indexOf(item) == pos;
        })
        let metaDesc = data1.heading1;
        let link = window.location.href;
        let title = 'Near-By Amenities List Page';
        let ImageU = data1.imageURL;
        this._seo.setTitle(title);
        this._seo.setMetaDescription(metaDesc);
        this._seo.setCanonicalLink(this._params,this.router);

        this._seo.setMetaTags(
            [
                {
                    'og:title': title,
                },
                {
                    'og:description': metaDesc,
                },
                {
                    'og:type':'website',
                },
                {
                    'og:url':link,
                },
                {
                    'og:image': ImageU,
                },
                {
                    'es_page_title': title,
                },
                {
                    'es_page_url': link
                },
                {
                    'es_description': metaDesc,
                },
                {
                    'es_page_type': 'Amenities List Page',
                },
                {
                    'es-category':data2[0].categories,
                },
                {
                    'es_keywords': filteredkArray.join(','),
                }
            ]
        )

    }
}
