import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';

import {ProfileHeader} from '../../modules/profile_header/profile_header.module';
import {HeadlineComponent} from '../../components/headline/headline.component';
import {MediaFeatureModule} from "../../modules/media_features/media_features.module";
import {CommentModule} from "../../modules/comment/comment.module";
import {CrimeModule} from "../../modules/crime/crime.module";
import {ListOfListModule} from "../../modules/listoflist/listoflist.module";
import {AboutUsModule} from "../../modules/aboutus/aboutus.module";
import {HeaderComponent} from "../../components/header/header.component";
import {FooterComponent} from "../../components/footer/footer.component";
import {LikeUs} from "../../modules/likeus/likeus.module";
import {ShareModule} from "../../modules/share/share.module";
import {AmenitiesModule} from "../../modules/amenities/amenities.module";
import {FeaturedListsModule} from '../../modules/featured_lists/featured_lists.module';
import {MediaImages} from "../../components/media-images/media-images.component";
import {TrendingHomes} from "../../modules/trending-homes/trending-homes.module";
import {ListingProfileService} from '../../global/listing-profile.service';
import {WidgetModule} from "../../modules/widget/widget.module";
import {MapModule} from '../../modules/map/map.module';
import {ListOfListPage} from '../../global/global-service';
import {magazineBanner} from '../../modules/mag_banner/mag_banner.module';
import {magazineModule} from '../../modules/mag_module/mag_module';
import {Injector} from 'angular2/core';
import {GlobalFunctions} from '../../global/global-functions';
import {LoadingComponent} from '../../components/loading/loading.component';
import {ErrorComponent} from '../../components/error/error.component';
import {SeoService} from "../../global/seo.service";

declare var lh: any;

@Component({
    selector: 'profile-page',
    templateUrl: './app/webpages/profile-page/profile.page.html',

    directives: [magazineModule, magazineBanner, TrendingHomes, MediaImages, HeadlineComponent, ProfileHeader, MediaFeatureModule, CommentModule, CrimeModule, ListOfListModule, AboutUsModule, HeaderComponent, FooterComponent, LikeUs, ShareModule, FeaturedListsModule, AmenitiesModule, WidgetModule, MapModule, LoadingComponent, ErrorComponent],
    providers: [ListOfListPage, ListingProfileService, SeoService]
})

export class ProfilePage implements OnInit{
    paramAddress: string;
    address: string;
    city: string;
    state: string;
    public locData: Object;
    public pageName: string;
    public headlineAbout: any;
    public headlineCrime: any;
    public headlineAmenities: any;
    public headlineOtherHomes: any;
    public headlineInteract: any;
    public lists: any;
    public mediaFeature: boolean = false;
    public trendingFeature: boolean = true;
    public partnerCheck: boolean;
    public trendingHomesData: Object;
    public profileHeaderData: Object;
    public propertyListingData: Object;
    public crimeData: Object;
    public mapData: Object;
    public featuredListData: Object;
    public amenitiesData: Object;
    public partnerParam: string;
    public partnerID: string;
    public isError: boolean = false;
    public isChecked: boolean;

    public addressObject: {
        address: string;
        city: string;
        state: string;
        stateAP: string;
        listingImage: string;
        propertyType: string;
    };
    //  Get current route name
    constructor(private _router:Router, private _listingProfileService: ListingProfileService, private _params: RouteParams, private _listService:ListOfListPage, private globalFunctions: GlobalFunctions, private _seo:SeoService){
      this._router.root
          .subscribe(
              route => {
                var curRoute = route;
                var partnerID = curRoute.split('/');
                if(partnerID[0] != ''){
                  this.partnerID = partnerID[0];
                  this.isChecked = true;
                  var partnerParam = this.partnerID.replace('-','.');
                }else{
                  this.partnerID = null;
                  this.isChecked = true;
                }
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
          })
        this.paramAddress = _params.get('address');
        window.scrollTo(0, 0);
    }

    getProfileHeader(){
        this._listingProfileService.getListingProfile(this.paramAddress)
            .subscribe(
                data => {
                    this.profileHeaderData = data;

                    this.addressObject = {
                        address: data.address === null ? '' : this.globalFunctions.toTitleCase(data.address),
                        city: data.city === null ? '' : this.globalFunctions.toTitleCase(data.city),
                        state: data.state === null ? '' : data.state.toUpperCase(),
                        stateAP: this.globalFunctions.stateToAP(data.state),
                        listingImage: data.listingImage,
                        propertyType: data.propertyType
                    };
                    this.locData = {
                      city: data.city === null ? '' : this.globalFunctions.toTitleCase(data.city),
                      state: data.state === null ? '' : data.state.toUpperCase(),
                      stateAP: this.globalFunctions.stateToAP(data.state),
                      stateAbbreviation: data.state.toUpperCase(),
                    };

                    //Set titles for headlines based on profile header data
                    this.setHeadlines();

                    var listingKey = data['listingKey']; //send key to listhub
                    lh('submit', 'DETAIL_PAGE_VIEWED', {lkey:listingKey});
                    this.profileHeaderData['paramAddress'] = this.paramAddress;
                    this.createMetaTags(this.profileHeaderData);
                },
                err => {
                    console.log('Error - Listing Profile Header Data: ', err);
                    this.isError = true;
                }
            )
    }

    getCrime(){
        this._listingProfileService.getCrime(this.paramAddress)
            .subscribe(
                data => {
                    this.crimeData = data.crimes;
                },
                err => console.log('Error - Crime Data: ', err)
            )
    }

    getMap(){
        this._listingProfileService.getMap(this.paramAddress)
            .subscribe(
                data => {
                    //Check to see if map data exists
                    if(typeof data !== 'undefined' && data.length !== 0){
                        var hasGeoData = false;

                        for(var i = 0, length = data.length; i < length; i++){
                            if(data[i].latitude !== null && data[i].longitude !== null){
                                hasGeoData = true;
                                break;
                            }
                        };
                        if(hasGeoData === true){
                            this.mapData = data;
                        }else{
                            this.mapData = undefined;
                        }
                    }else{
                        this.mapData = undefined;
                    }
                },
                err => console.log('Error - Map Data', err)
            )
    }

    getFeaturedList(){
        this._listingProfileService.getListingFeaturedList(this.paramAddress)
            .subscribe(
                data => {
                    this.featuredListData = data;
                },
                err => console.log('Error - Listing Featured List Data: ', err)
            )
    }

    getTrendingListings(){
        this._listingProfileService.getTrendingHomesData(this.paramAddress, 1)
            .subscribe(
                data => {
                    this.trendingHomesData = data;
                },
                err => console.log('Error - Location Trending Homes Data: ', err)
            )
    }

    getAmenitiesData(){
        this._listingProfileService.getAmenitiesNearListing(this.paramAddress)
          .subscribe(
              data => {
                this.amenitiesData = data;
              },
              err => console.log('Amenities Location Data Acquired!', err)
            )
    }

    getPropertyListing(){
      this.propertyListingData = this._listingProfileService.getPropertyListing(this.paramAddress);
    }

    getListOfList() {
        this._listService.getAddressListOfListPage(this.paramAddress)
        .subscribe(lists => {
          this.lists = lists
        });
    }

    //Sets the titles of the headline components based on profile header data
    setHeadlines(){
        var address = this.addressObject.address + ', ' + this.addressObject.city + ', ' + this.addressObject.stateAP;

        this.headlineAbout  = {
            title: 'About ' + address,
            icon: 'fa-map-marker'
        };
        this.headlineCrime  = {
            title: 'Most Recent Crimes in ' + address,
            icon: 'fa-gavel'
        };
        this.headlineAmenities = {
            title: 'Amenities Around ' + address,
            icon: 'fa-cutlery'
        };
        this.headlineOtherHomes = {
            title: 'Other Homes You May Be Interested In',
            icon: 'fa-heart-o'
        };
    }

    ngOnInit(){
      //Run each call
        this.getProfileHeader();
        this.getCrime();
        this.getMap();
        this.getFeaturedList();
        this.getAmenitiesData();
        this.getTrendingListings();
        this.getListOfList();
    }
    /* Navigates to top of page on navigation */
    routerOnDeactivate(){
        window.scrollTo(0,0);
    }

    createMetaTags(data){
        this._seo.removeMetaTags();


        let metaDesc = "This " + data.propertyType + " listing is located at " + data.address+', '+data.city+', '+data.state + " The living area is around " + data.squareFeet + ". Agent: " + data.agent+'. Listing status: '+data.listingStatus;

        let link = window.location.href;
        let title = 'Listing Profile Page';
        this._seo.setTitle(title);
        this._seo.setMetaDescription(metaDesc);
        this._seo.setCanonicalLink(this._params,this._router);
        let image = data.listingImage;

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
                    'og:image':image,
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
                    'es_page_type': 'Profile Page',
                },
                {
                    'es_keywords': 'joyful home, Profile, ' + data.city+ ', ' + data.state + ', ' + data.zipcode + ', ' +data.address + ', ' + data.agent+  ', ' +data.brokerageName+  ', ' +data.propertyType+  ', ' +data.listingPrice,
                },
                {
                    'es_image_url':image,
                },
                {
                    'es_category':'real estate',
                }
            ]
        )

    }
}
