import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig, AsyncRoute, APP_BASE_HREF, RouteParams, Router} from 'angular2/router';
import {Contact} from "../modules/magazine/contact/contact.module";
import {Neighborhood} from "../modules/magazine/neighborhood/neighborhood.module";
import {Recommendations} from "../modules/magazine/recommendations/recommendations.module";
import {MagHeaderModule} from "../modules/magazine/mag-header/mag-header.module";
import {FooterComponent} from "../components/magazine/mag-footer/mag-footer.component";
import {MagazineDataService} from "../global/global-mag-service";
import {MagOverviewModule} from "../modules/magazine/mag-overview/mag-overview.module";
import {MagOverview, MagData} from "../global/global-interface";
import {Amenities} from "../modules/magazine/mag-amenities/mag-amenities.module";
import {KeyInformation} from "../modules/magazine/key-information/key-information.module";
import {NavLeftComponent} from "../components/magazine/mag-nav-left/mag-nav-left.component";
import {NavRightComponent} from "../components/magazine/mag-nav-right/mag-nav-right.component";
import {MagErrorModule} from "../modules/magazine/mag-error/mag-error.module";
import {SeoService} from "../global/seo.service";

declare var jQuery:any;

@Component({
    selector: 'magazine-page',
    templateUrl: './app/app-webpage/magazine.webpage.html',

    directives: [Contact, Neighborhood, Recommendations, Amenities, MagHeaderModule, FooterComponent, ROUTER_DIRECTIVES, MagOverviewModule, NavLeftComponent, NavRightComponent, MagErrorModule],
    providers: [MagazineDataService, SeoService],
})

@RouteConfig([
    new AsyncRoute({
        path: '/overview',
        loader: () => Promise.resolve(MagOverviewModule),
        name: 'PropertyOverview',
        useAsDefault: true,
    }),
    new AsyncRoute({
        path: '/neighborhood',
        loader: () => Promise.resolve(Neighborhood),
        name: 'Neighborhood'
    }),
    new AsyncRoute({
        path: '/recommendations',
        loader: () => Promise.resolve(Recommendations),
        name: 'Recommendations'
    }),
    new AsyncRoute({
        path: '/information',
        loader: () => Promise.resolve(KeyInformation),
        name: 'KeyInformation'
    }),
    new AsyncRoute({
        path: '/amenities',
        loader: () => Promise.resolve(Amenities),
        name: 'Amenities'
    }),
    new AsyncRoute({
        path: '/contact',
        loader: () => Promise.resolve(Contact),
        name: 'Contact',
    }),
    {
        path: '/**',
        redirectTo: ['PropertyOverview']
    }
])

export class MagazinePage {
    address:string;
    toc:any;
    magazineData:MagData;
    currentIndex:any;
    showErrorPage:boolean = false;
    static timeout:number;

    constructor(private _params:RouteParams, private _magazineDataService:MagazineDataService, private _router:Router, private _seo:SeoService) {
        this.address = _params.get('addr');
        this.getMagServiceData();
    }

    getMagServiceData() {
        this._magazineDataService.getMagazineData(this.address)
            .subscribe(
                rawData => {
                    this.magazineData = rawData;
                    this.toc = this.buildToc(rawData);
                    this.createMetaTags(this.magazineData, this.toc);

                },
                err => {
                    this._router.navigate(['../Webpages', 'Profile-page', {address: this.address}]);
                    //this.showErrorPage = true; <--This stays for when this is fixed the correct way.
                },
                () => this.showErrorPage = false
            );
    }

    buildToc(magazineData) {
        var toc:any = [];
        if (magazineData.overview != null) {
            toc.push({label: "Property Overview", routeName: "PropertyOverview"});
        }
        if (magazineData.neighborhood != null) {
            toc.push({label: "The Neighborhood", routeName: "Neighborhood"});
        }
        if (magazineData.recommendations != null && magazineData.recommendations.similar.length > 1) {
            toc.push({label: "Recommendations", routeName: "Recommendations"});
        }
        if (magazineData.info != null && magazineData.info.demographics != null && magazineData.info.schools != null) {
            toc.push({label: "Key Information", routeName: "KeyInformation"});
        }
        if (magazineData.amenities != null) {
            toc.push({label: "Amenities", routeName: "Amenities"});
        }
        if (magazineData.contact != null) {
            toc.push({label: "Contact Agent", routeName: "Contact"});
        }
        return toc;
    }

    buildNavigationElements() {
        this.currentIndex = jQuery("magtab-component>span>a.router-link-active").index();
        if (this.currentIndex < 1) {
            this.currentIndex = 0;
        }
        jQuery(".magheader_pagenum").html(this.currentIndex + 1);
        jQuery(".currentIndexFooter").html(this.currentIndex + 1);
    }

    ngAfterViewChecked() {
        this.buildNavigationElements();
        //removes min-height that is used on joyfulHome page.
        jQuery('.page-wrapper').css('min-height', 0);
    }

    createMetaTags(data1, data2){
        this._seo.removeMetaTags();

        var keywords=[];
        let metaDesc = data1.overview!=null||data1.overview!=undefined?data1.overview.content[0]+data1.overview.content[1]:'';
        data2.forEach((val)=>{
            keywords.push(val.label);
        });
        keywords.join(',');
        let link = window.location.href;
        let title = 'Magazine';
        this._seo.setTitle(title);
        this._seo.setMetaDescription(metaDesc.substr(0,167)+'...');
        this._seo.setCanonicalLink(this._params,this._router);
        let image = data1.overview!=null||data1.overview!=undefined? data1.overview.photos[0]:'';

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
                    'es_page_type': 'Magazine',
                },
                {
                    'es_keywords': 'joyful home, Magazine, ' +data1.contact.address.fullStreetAddress+', '+ data1.contact.address.city +', '+data1.contact.address.state+', '+data1.contact.address.postalCode+', '+data1.info.demographics.formattedPrice
                    +', ' + keywords,
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
