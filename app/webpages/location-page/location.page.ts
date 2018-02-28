import {Component, OnInit, OnChanges, Input} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';

import {HeadlineComponent} from '../../components/headline/headline.component';
import {ProfileHeader} from '../../modules/profile_header/profile_header.module';
import {CrimeModule} from '../../modules/crime/crime.module';
import {FeaturedListsModule} from '../../modules/featured_lists/featured_lists.module';
import {InfoListModule} from "../../modules/infolist/info-list.module";
import {CommentModule} from '../../modules/comment/comment.module';
import {ListOfListModule} from "../../modules/listoflist/listoflist.module";
import {LikeUs} from '../../modules/likeus/likeus.module';
import {ShareModule} from '../../modules/share/share.module';
import {AboutUsModule} from '../../modules/aboutus/aboutus.module';
import {SchoolModule} from "../../modules/school/school.module";
import {LocationProfileService} from '../../global/location-profile.service';
import {ListOfListPage} from '../../global/global-service';
import {WidgetModule} from "../../modules/widget/widget.module";
import {FindYourHomeModule} from "../../modules/find-your-home/find-your-home.module";
import {AmenitiesModule} from "../../modules/amenities/amenities.module";
import {TrendingHomes} from "../../modules/trending-homes/trending-homes.module";
import {Injector} from 'angular2/core';
import {WebApp} from '../../app-layout/app.layout';
import {MyWebApp} from '../../app-layout/app.mylayout';
import {LoadingComponent} from '../../components/loading/loading.component';
import {ErrorComponent} from '../../components/error/error.component';
import {GlobalSettings} from "../../global/global-settings";
import {GlobalFunctions} from "../../global/global-functions";
import {GeoLocation} from "../../global/global-service";
import {SeoService} from "../../global/seo.service";

@Component({
    selector: 'location-page',
    templateUrl: './app/webpages/location-page/location.page.html',

    directives: [ListOfListModule, HeadlineComponent, ProfileHeader, CrimeModule, FeaturedListsModule, FindYourHomeModule, InfoListModule, CommentModule, LikeUs, ShareModule, AboutUsModule, SchoolModule, WidgetModule, AmenitiesModule, TrendingHomes, ErrorComponent, LoadingComponent],
    providers: [ListOfListPage, LocationProfileService, GlobalFunctions, SeoService]
})

export class LocationPage {
    loc: string;
    locCity: string;
    locState: string;
    locData: any;
    public locDisplay: string;
    public headlineAbout: any;
    public headlineCrime: any;
    public headlineSchool: any;
    public headlineInteract: any;
    public lists: any;
    public profileHeaderData: Object;
    public featuredListData: Object;
    public crimeData: Object;
    public recentListingsData: Object;
    public schoolData: Object;
    public amenitiesData: Object;
    public trendingHomesData: Object;
    public trendingFeature = true;
    public partnerParam: string;
    public partnerData:any;
    public partnerID: string;
    public partnerCheck: boolean;
    public pageName: string;
    public isError: boolean = false;
    public isChecked: boolean;

    constructor(
      private _router:Router,
      private _params: RouteParams,
      private _locationProfileService: LocationProfileService,
      private _listService: ListOfListPage,
      private _globalFunctions: GlobalFunctions,
      private _geoLocation: GeoLocation,
    private  _seo:SeoService) {

        this._router.root
            .subscribe(
                route => {
                  var partnerID = GlobalSettings.storedPartnerId();
                  var hostname = window.location.hostname;
                  var myhousekit = /myhousekit/.test(hostname);
                  var isSubDomain = GlobalSettings.getHomeInfo().isSubdomainPartner;

                  this._geoLocation.grabLocation(this.partnerID)
                  .subscribe(
                      res => {
                      this.partnerData = res;
                      this.locCity = this._globalFunctions.toTitleCase(decodeURI(res['userCity']));
                      this.locState = decodeURI(res['userState']).toUpperCase();
                      this.dataCalls();
                      }
                  );
                  this.isChecked = true;
                  if(this.partnerID === null || this.partnerID == '' || typeof this.partnerID == 'undefined'){
                    this.partnerCheck = false;
                    this.pageName = "Joyful Home";
                  } else {
                    this.partnerCheck = true;
                    this.pageName = "My HouseKit";
                  }
                  this.headlineInteract = {
                      title: 'Interact with ' + this.pageName,
                      icon: 'fa-comment-o'
                  };
                }
            )//end of route subscribe
        // Scroll page to top to fix routerLink bug
        window.scrollTo(0, 0);
    }

    getProfileHeader(){
        this._locationProfileService.getLocationProfile(this.locCity, this.locState)
            .subscribe(
                data => {
                    this.profileHeaderData = data;
                    this.locData = {//USED IN MULTIPLE MODULES
                      city: this._globalFunctions.toTitleCase(this.profileHeaderData['city']),
                      state: this.profileHeaderData['state'].toUpperCase(),
                      stateAP:this._globalFunctions.stateToAP(this.profileHeaderData['state']),
                      stateAbbreviation: this.profileHeaderData['state'],
                      locationImage:this.profileHeaderData['locationImage']
                    }
                    this.createMetaTags(this.profileHeaderData);
                },
                err => {
                    console.log('Error - Location Profile Header Data: ', err),
                    this.isError = true
                }
            )
    }

    getTrendingListings(){
        this._locationProfileService.getTrendingHomesData(this.locCity, this.locState, 1)
            .subscribe(
                data => {
                    this.trendingHomesData = data;
                },
                err => console.log('Error - Location Trending Homes Data: ', err)
            )
    }

    getFeaturedList(){
        this._locationProfileService.getLocationFeaturedList(this.locCity, this.locState, 1)
            .subscribe(
                data => {
                    this.featuredListData = data;
                },
                err => console.log('Error - Location Profile: ', err)
            );
    }

    getCrime(){
        this._locationProfileService.getCrime(this.locCity, this.locState)
            .subscribe(
                data => {
                    this.crimeData = data.crimes;
                },
                err => console.log('Error - Crime: ', err)
            )
    }

    getRecentListings() {
        this._locationProfileService.getRecentListings(this.locCity, this.locState, 1)
            .subscribe(
                recentListingsData => { this.recentListingsData = recentListingsData },
                err => console.log(err)
            );
    }

    getSchoolData(){
        this._locationProfileService.getSchoolData(this.locCity, this.locState)
          .subscribe(
              data => {
                this.schoolData = data;
              },
              err => console.log('School Location Data Acquired!', err)
            )
    }

    getAmenitiesData(){
      this._locationProfileService.getAmenitiesData(this.locCity, this.locState)
        .subscribe(
            data => {
              this.amenitiesData = data;
            },
            err => console.log('Amenities Location Data Acquired!', err)
          )
    }

    getListOfList() {
        this._listService.getListOfListPage(this.locState, this.locCity)
        .subscribe(lists => {
          this.lists = lists
        });
    }

    dataCalls() {
      //checks if it is a partner page with no location then grab partner location infomation
        if(typeof this._params.get('loc') == 'undefined' || this._params.get('loc') == null){
            this.locDisplay = decodeURI(this.locCity + ', ' + this._globalFunctions.stateToAP(this.locState));
        }else{//end of if for partner page :loc check, start of else
          this.loc = this._params.get('loc');
          let tmp = decodeURI(this.loc).split("-");
          // assigns value to this.locState and removes last item in tmp array
          this.locState = tmp.pop().toUpperCase();
          let tmpCity = tmp.join(" ");
          this.locCity = this._globalFunctions.toTitleCase( tmpCity );
          this.locDisplay = decodeURI(this.locCity + ', ' + this._globalFunctions.stateToAP(this.locState));
        }

        this.headlineAbout = {
            title: 'About ' + this.locDisplay,
            icon: 'fa-map-marker'
        };

        this.headlineCrime = {
            title: 'Most Recent Crimes in ' + this.locDisplay,
            icon: 'fa-gavel'
        };

        this.headlineSchool = {
            title: 'Schools and Amenities in ' + this.locDisplay,
            icon: 'fa-graduation-cap'
        };

        this.getProfileHeader();
        this.getTrendingListings();
        this.getFeaturedList();
        this.getCrime();
        this.getRecentListings();
        this.getSchoolData();
        this.getAmenitiesData();
        this.getListOfList();
    }
    /* Navigates to top of page on navigation */
    routerOnDeactivate(){
        window.scrollTo(0,0);
    }

    createMetaTags(data){
        this._seo.removeMetaTags();


        let metaDesc = "Did you know that average rental price for a wichita resident is " + data.averageRentalPrice + "/month, average age is " + data.averageAge + " and the average home sells for " + data.averageListingPrice+'?';

        let link = window.location.href;
        let title = 'Location View Page';
        this._seo.setTitle(title);
        this._seo.setMetaDescription(metaDesc);
        this._seo.setCanonicalLink(this._params,this._router);

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
                    'og:image':data.locationImage
                },
                {
                    'es_page_title': title,
                },
                {
                    'es_page_url': link,
                },
                {
                    'es_description': metaDesc,
                },
                {
                    'es_page_type': 'Location Page',
                },
                {
                    'es_keywords': 'joyful home, location, ' + data.city+ ', ' + data.state,
                },
                {
                    'es_image_url':data.locationImage,
                },
                {
                    'es_category':'real estate',
                }
            ]
        )

    }
}
