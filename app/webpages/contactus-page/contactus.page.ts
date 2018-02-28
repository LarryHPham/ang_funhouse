/**
 * Created by Victoria on 3/1/2016.
 */
import {Component, OnInit} from 'angular2/core';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {TitleComponent} from '../../components/title/title.component';
import {WidgetModule} from "../../modules/widget/widget.module";
import {AuHeaderComponent} from '../../components/au-header/au-header.component';
import {GlobalFunctions} from '../../global/global-functions';
import {SeoService} from "../../global/seo.service";
import {RouteParams} from "angular2/src/router/instruction";
import {Router} from "angular2/src/router/router";

declare var jQuery: any;

@Component({
    selector: 'Contactus-page',
    templateUrl: './app/webpages/contactus-page/contactus.page.html',

    directives: [BackTabComponent, TitleComponent, AuHeaderComponent, WidgetModule],
    providers: [SeoService],
})

export class ContactUsPage implements OnInit{
    //PLACEHOLDERS
    full_name = "John Smith";
    email = "email@domain.com";
    text_area = "Detailed description of your question here...";
    title_data: {};
    submissionform: any;
    auHeaderTitle = "Contact Us";
    constructor(private globalFunctions: GlobalFunctions, private _seo:SeoService, private _routeParams:RouteParams, private _router:Router) {
    // Scroll page to top to fix routerLink bug
    window.scrollTo(0, 0);
  }

    getData(){
        //Contact us data
        this.title_data = {
            imageURL : '/app/public/joyfulhome_house.png',
            smallText1 :'Last Updated: ' + this.globalFunctions.formatGlobalDate(new Date(),'timeZone'),
            smallText2 : ' United States',
            heading1 : 'Contact Us',
            heading2 : '',
            heading3 : 'Help Us, Help You Faster.',
            heading4 : '',
            icon: 'fa fa-map-marker',
            hasHover: false
        };
        this.createMetaTags(this.title_data);
    }

    formSubmit(){
      if(jQuery(".ff-fullname").val() == "")
      {
        alert("Please Fill in your name.");
        return false;
      }
      if(jQuery(".ff-email").val() == "")
      {
        alert("Please enter in an email.");
        return false;
      }
      if(jQuery(".ff-textfield").val() == "")
      {
        alert("Please enter in your message.");
        return false;
      }
      return true;
    }

    ngOnInit(){
        this.getData();
    }
    /* Navigates to top of page on navigation */
    routerOnDeactivate(){
        window.scrollTo(0,0);
    }

    createMetaTags(data){
        this._seo.removeMetaTags();

        let metaDesc = data.heading3;
        let link = window.location.href;
        let title = data.heading1;
        let ImageU = data.imageURL;
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
                    'es_page_type': 'Contact us page',
                },
                {
                    'es_keywords': 'joyful home, contact us',
                },
                {
                    'es_category':'real estate',
                }
            ]
        )

    }

}
