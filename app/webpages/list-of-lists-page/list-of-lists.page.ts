import {Component, OnInit} from 'angular2/core';
import {RouteParams} from "angular2/router";
import {BackTabComponent} from "../../components/backtab/backtab.component";
import {TitleComponent} from "../../components/title/title.component";
import {ListCarouselComponent} from "../../components/list-carousel/list-carousel.component";
import {ListOfListPage} from '../../global/global-service';
import {contentList} from "../../components/contentlist/contentlist";
import {List} from "../../global/global-interface";
import {HeroListComponent} from "../../components/hero/hero-list/hero-list.component";
import {WidgetModule} from "../../modules/widget/widget.module";
import {GlobalFunctions} from "../../global/global-functions";
import {GlobalSettings} from "../../global/global-settings";
import {LoadingComponent} from '../../components/loading/loading.component';
import {ErrorComponent} from '../../components/error/error.component';
import {SeoService} from "../../global/seo.service";
import {Router} from "angular2/src/router/router";

@Component({
    selector: 'list-of-lists-page',
    templateUrl: './app/webpages/list-of-lists-page/list-of-lists.page.html',

    directives: [BackTabComponent, TitleComponent, ListCarouselComponent, contentList, HeroListComponent, WidgetModule, LoadingComponent, ErrorComponent],
    providers: [ListOfListPage,SeoService],
})

export class ListOfListsPage implements OnInit{
    public icon: string;
    public title: string;
    public description: string;
    public main_hasSubImg: boolean = true;
    public cityLocation: string;
    public stateLocation: string;
    public location: string;
    public isError: boolean = false;
    public isStateOnly: boolean = false;
    listOfLists: any;
    lists: Array<any> = [];
    titleData: Object;

    constructor(private _params: RouteParams, private _seo:SeoService, private _router:Router, private _listOfListPageService: ListOfListPage, private _listOfListPageServiceState: ListOfListPage, private _globalFunctions: GlobalFunctions) {
        // Scroll page to top to fix routerLink bug
        window.scrollTo(0, 0);
    }

    getListOfListPage() {
        this._listOfListPageService.getListOfListPage(this.stateLocation, this.cityLocation)
            .subscribe(
                listOfLists => this.listOfLists = listOfLists,

                err => {
                    console.log('Error: List of List Page API: ', err);
                    this.isError = true;
                },
                () => this.transformData()
            );
    }

    getListOfListPageState(){
        this._listOfListPageServiceState.getListOfListPageState(this.stateLocation)
            .subscribe(
                listOfLists => this.listOfLists = listOfLists,
                err => {
                    console.log('Error: List of List Page API: ', err);
                    this.isError = true;
                },
                () => this.transformData()
            );
    }

    transformData() {
        var self = this;
        var counter = 1;
        // Format data and convert object to array
        for( var i in this.listOfLists ) {
            if (this.listOfLists.hasOwnProperty(i)){
                // Counter for rank #
                this.listOfLists[i].counter = counter++;
                // Check if even or odd for BG color class
                if(this.listOfLists[i].counter % 2 == 0) {
                    this.listOfLists[i].bgClass = "even";
                }else{
                    this.listOfLists[i].bgClass = "odd";
                }
                // Save original for url
                this.listOfLists[i].listTitleOrig = this._globalFunctions.camelCaseToKababCase(this.listOfLists[i].listTitle);
                // Fix list title using global function cameCaseToRegularCase
                this.listOfLists[i].listTitle = self._globalFunctions.convertListName(this.listOfLists[i].listTitle);
                // Check for empty list
                if(this.listOfLists[i].listData === null || this.listOfLists[i].listData.length <= 0 ) {
                }else {
                    //Check for no image, replace with placeholder
                    this.listOfLists[i].listData.map(function(item){
                    if(item.photo === false || item.photo === null) {
                        item.photo = "app/public/no_photo_images/House_1.png";
                        }
                    });
                    this.lists.push(this.listOfLists[i]);
                }
            }

        }


        // Data for Title component
        if (!this.isStateOnly) {
            this.titleData =
            {
                imageURL: '/app/public/joyfulhome_house.png',
                smallText1: 'Last Updated: ' + this._globalFunctions.formatGlobalDate(new Date(),'timeZone'),
                smallText2: 'United States &nbsp;' + '| &nbsp;<p class="data-by-text">Data Provided By: ' + '<b>' + GlobalSettings.getDataProvidedBy() + '</b></p>',
                heading1: this._globalFunctions.toCapititalization(this.cityLocation) + ', ' + this._globalFunctions.stateToAP(this.stateLocation) + ' Top Lists',
                heading2: '',
                heading3: '',
                heading4: '',
                icon: 'fa fa-map-marker',
                hasHover: false
            };
        } else {
            this.titleData =
            {
                imageURL: '/app/public/joyfulhome_house.png',
                smallText1: 'Last Updated: ' + this._globalFunctions.formatGlobalDate(new Date(),'timeZone'),
                smallText2: 'United States &nbsp;' + '| &nbsp;<p class="data-by-text">Data Provided By: ' + '<b>' + GlobalSettings.getDataProvidedBy() + '</b></p>',
                heading1: this._globalFunctions.fullstate(this.stateLocation) + ' Top Lists',
                heading2: '',
                heading3: '',
                heading4: '',
                icon: 'fa fa-map-marker',
                hasHover: false
            };
        }
        this.createMetaTags(this.lists,this.titleData);


    }

    ngOnInit(){
        this.stateLocation = decodeURI(this._params.get('state'));
        this.cityLocation = decodeURI(this._params.get('city'));
        if (this.cityLocation != 'null') {
            this.location = this._globalFunctions.toTitleCase(this.cityLocation) + ', ' + this.stateLocation;
            this.getListOfListPage();
        } else {
            this.location = this.stateLocation;
            this.isStateOnly = true;
            this.getListOfListPageState();
        }
    }
    /* Navigates to top of page on navigation */
    routerOnDeactivate(){
        window.scrollTo(0,0);
    }
    createMetaTags(data1, data2){
        this._seo.removeMetaTags();


        let metaDesc ="Explore list of " + data1[0].listTitle + ". There are currently " + data1[0].listData[0].totalListings + " listings in this category";
        let link = window.location.href;
        let title = data1[0].listTitle;
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
                    'es_page_type': 'List of lists page',
                },
                {
                    'es_keywords': 'joyful home, list of lists, ' + data2.heading1,
                },
                {
                    'es_category':'real estate',
                }
            ]
        )

    }
}
