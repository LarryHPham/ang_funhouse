import {Component, Input, OnInit} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES,RouteParams} from 'angular2/router';

import {HeaderComponent} from "../../components/header/header.component";
import {FooterComponent} from "../../components/footer/footer.component";
import {HeroComponent} from "../../components/hero/hero.component";
import {ExploreTilesComponent} from "../../components/explore-tiles/explore-tiles.component";
import {ExploreButtonComponent} from "../../components/buttons/explore-button/explore-button.component";
import {HeroBottomComponent} from "../../components/hero/hero-bottom/hero-bottom.component";
import {FeatureTilesComponent} from "../../components/feature-tiles/feature-tiles.component";
import {GeoLocationService} from "../../global/geo-location.service";
import {NearByCitiesService} from "../../global/geo-location.service";
import {GlobalSettings} from "../../global/global-settings";
import {GlobalFunctions} from "../../global/global-functions";
import {PartnerHomePage} from "../partner-home-page/partner-home-page";
import {GeoLocation} from "../../global/global-service";
import {SeoService} from "../../global/seo.service";
//import map = webdriver.promise.map;

declare var jQuery:any;

@Component({
    selector: 'PartnerHomePage',
    templateUrl: './app/webpages/home-page/home.page.html',

    directives: [PartnerHomePage, HeaderComponent, FooterComponent, HeroComponent, ExploreTilesComponent, ExploreButtonComponent, HeroBottomComponent, FeatureTilesComponent, ROUTER_DIRECTIVES],
    providers: [GeoLocationService, NearByCitiesService, SeoService],
    inputs: [],
})

export class HomePage implements OnInit {

    // Location data
    geoData: any;
    public partnerID: string;
    nearByCities: Object;

    // Buttons
    buttonTitle: string;
    buttonWidth: number;
    buttonIcon: string;
    buttonUrl: string;
    heroButtonTitle: string;
    heroButtonWidth: number;
    heroButtonIcon: string;
    isMyHouseKitHome: boolean;//determine which homepage to show myhousekit or joyfulhome.

    constructor(private _router: Router, private _routeParams:RouteParams, private _geoLocationService: GeoLocationService, private _nearByCitiesService: NearByCitiesService, private _globalFunctions: GlobalFunctions, private _geoLocation: GeoLocation, private _seo:SeoService) {
        // Scroll page to top to fix routerLink bug
        window.scrollTo(0, 0);
        this._router.root
            .subscribe(
                route => {
                  var curRoute = route;
                  var partnerID = GlobalSettings.storedPartnerId();
                  var hostname = window.location.hostname;

                  var myhousekit = /myhousekit/.test(hostname);
                  var isSubDomain = GlobalSettings.getHomeInfo().isSubdomainPartner;

                  if( !partnerID && myhousekit){
                    jQuery('.webpage-home').css('display','none');
                    this.isMyHouseKitHome = true;
                    document.title = "MyHousekit";
                  }else if( partnerID && myhousekit || partnerID && isSubDomain){
                    jQuery('.webpage-home').css('display','block');
                    document.title = "MyHousekit " + partnerID;
                  }else{
                    jQuery('.webpage-home').css('display','block');
                    this.isMyHouseKitHome = false;
                    document.title = "Joyful Home";
                  }
                }//end route
            )//end of route subscribe
    }

    getGeoLocation() {
      this._geoLocation.getGeoLocation().subscribe(res => {
        if (res.userCity == null || res.userState == null){
          this.defaultCity();
        } else {
          this.geoData = {
            cityUrl          : this._globalFunctions.toLowerKebab(res.userCity),
            cityNameDisplay  : this._globalFunctions.toTitleCase(res.userCity.replace(/%20/g, ' ')),
            stateNameDisplay : this._globalFunctions.stateToAP(res.userState),
            stateUrl         : this._globalFunctions.toLowerKebab(res.userState),
            stateAPLocation  : this._globalFunctions.stateToAP(res.userState)
          }
          this.getNearByCities();
        }
      },
      err => this.defaultCity()
      );
    }

    // Subscribe to getNearByCities in geo-location.service.ts
    getNearByCities() {
        this._nearByCitiesService.getNearByCities(this.geoData['stateUrl'], this.geoData['cityNameDisplay'])
            .subscribe(
                nearByCities => {
                    this.nearByCities = nearByCities;
                    for( var i in this.nearByCities ) {
                        if (this.nearByCities.hasOwnProperty(i) && i != 'citiesCount') {
                            this.nearByCities[i].stateAPLocation = this._globalFunctions.stateToAP(this.nearByCities[i].state);
                        }
                    }
                },
                err => console.log(err)
            );
    }

    defaultCity() {
        // Set default city and state if geo location call fails
        this.geoData = {
          cityUrl           : "wichita",
          cityNameDisplay   : "Wichita",
          stateNameDisplay  : "Kansas",
          stateUrl  : "ks",
          stateAPLocation   : "Kan."
        }
        this.getNearByCities();
    }

    ngOnInit() {

        // Set button options. Passed to explore-button-component and hero-bottom-component.
        this.buttonTitle = "More";
        this.buttonWidth = 160;
        this.buttonIcon = "fa fa-angle-double-down";
        this.buttonUrl = "";
        this.heroButtonTitle = "See The List";
        this.heroButtonWidth = 220;
        this.heroButtonIcon = "";

        // Call to get current State and City
        this.getGeoLocation();
        this.createMetaTags();
    }
    /* Navigates to top of page on navigation */
    routerOnDeactivate(){
        window.scrollTo(0,0);
    }
    createMetaTags(){
        this._seo.removeMetaTags();


        let metaDesc ="Enter the address or location you are interested in purchasing a home. Also explore the rich content written about your home.";
        let link = window.location.href;
        let title = 'Home Page';
        this._seo.setTitle(title);
        this._seo.setMetaDescription(metaDesc);
        this._seo.setCanonicalLink(this._routeParams,this._router);

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
                    'og:image':'/app/public/joyfulhome_house.png',
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
                    'es_page_type': 'Home page',
                },
                {
                    'es_keywords': 'joyful home, Home page, search',
                },
                {
                    'es_category':'real estate',
                }
            ]
        )

    }
}
