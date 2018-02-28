import {Injectable} from "angular2/src/core/di/decorators";
import {GlobalSettings} from "./global-settings";
import {DOM, DomAdapter} from "angular2/src/platform/dom/dom_adapter";
import {BrowserDomAdapter} from 'angular2/platform/browser';



@Injectable()

export class SeoService{
    private document:any;
    private DOM:any;
    private headElement: HTMLElement;
    private metaDescription: HTMLElement;
    private robots: HTMLElement;
    private ogElement: HTMLElement;


    constructor(){
        this.DOM = new BrowserDomAdapter();
        this.document = document;
        this.headElement = this.document.head;

    }
    //sets title to atleast less than 55 characters and will choose the  first 3 words and append site name at end
    public setTitle(newTitle:string) {
        let splitTitle = newTitle.split(' ');
        let shortTitle;

        if (newTitle.length > 55) {
            splitTitle = splitTitle.splice(0, 3);
            shortTitle = splitTitle.join(' ');
        } else {
            shortTitle = splitTitle.join(' ');
        }

        if (GlobalSettings.getHomeInfo().isPartner) {
            shortTitle = shortTitle + ' | ' + GlobalSettings.getBasePartnerTitle();
        } else {
            shortTitle = shortTitle + ' | ' + GlobalSettings.getBaseTitle();
        }

        this.document.title = shortTitle;
    }

    private setElementAttribute(el:HTMLElement, name:string, attr:string) {
        return this.DOM.setAttribute(el, name, attr);
    }

    static checkData(data) {
        var check;
        check = !!(data != null && data != "");
        return check;
    }

    /**
     * get the HTML Element when it is in the markup, or create it.
     * @param name
     * @returns {HTMLElement}
     */
    private getOrCreateElement(name:string, attr:string, type:string):HTMLElement {
        let el:HTMLElement;
        el = this.DOM.createElement(type);
        this.setElementAttribute(el, name, attr);
        if (attr != "canonical") {
            this.setElementAttribute(el, "rel", "jfh");
        }
        this.DOM.insertBefore(this.document.head.lastChild, el);
        return el;
    }

    //Valid values for the "CONTENT" attribute are: "INDEX", "NOINDEX", "FOLLOW", "NOFOLLOW"
    //http://www.robotstxt.org/meta.html
    public setMetaRobots(robots:string) {
        if (SeoService.checkData(robots)) {
            if (!this.document.querySelector('meta[name="robots"]')) {
                this.robots = this.getOrCreateElement('name', 'robots', 'meta');
            }
            this.setElementAttribute(this.robots, 'content', robots);
        }
    }

    public setMetaDescription(description: string) {
        if (SeoService.checkData(description)) {
            let html = description;
            let div = document.createElement("div");
            div.innerHTML = html;
            let truncatedDescription = div.textContent || div.innerText || "";
            if (truncatedDescription.length > 167) {
                truncatedDescription = truncatedDescription.substring(0, 167);
                truncatedDescription += '...';
            }
            if (!this.document.querySelector('meta[name="description"]')) {
                this.metaDescription = this.getOrCreateElement('name', 'description', 'meta');
            }
            this.setElementAttribute(this.metaDescription, 'content', truncatedDescription);
        }

    }
    public setMetaTags(metaAttr:Array<any>){
        for(var i=0;i<metaAttr.length;i++){
            let metaKey = Object.keys(metaAttr[i])[0];
            if(SeoService.checkData(metaAttr[i][metaKey])){
                if(!this.document.querySelector('meta[property = ogKey]')){
                    this.ogElement = this.getOrCreateElement('property', metaKey, 'meta');
                }
                this.setElementAttribute(this.ogElement,'content',metaAttr[i][metaKey]);
            }

        }

    }

    public setCanonicalLink(RouteParams, router):HTMLElement {
        let el:HTMLElement;
        el = this.DOM.query("link[rel='canonical']");
        let canonicalLink = window.location.href;
        if (el === null) {
            el = this.DOM.createElement('link');
            el.setAttribute('rel', 'canonical');
            el.setAttribute('href', canonicalLink);
            this.headElement.appendChild(el);
        } else {
            el.setAttribute('href', canonicalLink);
        }
        return el;
    }

    public removeMetaTags() {
        var element = this.document.getElementsByTagName('meta'), index;
        for (index = element.length - 1; index >= 0; index--) {
            if (element[index].getAttribute('rel') == 'jfh') {
                element[index].parentNode.removeChild(element[index]);
            }
        }
    }

    public elasticSearchUserAgent(){
        // preRender && PhantomJS or sntCrawler && nutch are specific keywords found when prerender or SNT crawler is being used to crawler the site for Elastic search
        let preRender = navigator.userAgent.indexOf("Prerender") > 0;
        let phantomJS = navigator.userAgent.indexOf("PhantomJS") > 0;
        let sntCrawler = navigator.userAgent.indexOf("SNTCrawler") > 0;
        let nutch = navigator.userAgent.indexOf("Nutch") > 0;

        if( (preRender && phantomJS) || (sntCrawler && nutch) ){
            return true;
        }else{
            return false;
        }
    }


}
