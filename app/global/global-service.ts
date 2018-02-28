/*
 GLOBAL SERVICE INDEX

 @LOCATIONPROFILE
 _@BATCH-1
 _@BATCH
 */
import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {Observable} from "rxjs/Observable";
import {GlobalFunctions} from "../global/global-functions";
import {GlobalSettings} from "../global/global-settings";
import {List, List2, HomePageData} from './global-interface';

export interface geoLocate {
    partner_id?: string;
    partner_script?: string;
    height?:any;
    state?: string;
    city?: string;
    zipcode?: string;
};

@Injectable()

export class GeoLocation{
    geoData: any;
    geoObservable: Observable<any>;

    constructor(public http: Http) { }

    getPartnerData(partner_id) {
      let env = window.location.hostname.split('.')[0];
      //let env = 'localhost';
      if(env == 'localhost'){
        var partnerID = partner_id.split('-');

        //handles some cases where domain registries are different
        var combinedID = [];
        var domainRegisters = [];
        for (var i = 0; i < partnerID.length; i++) {
            if (partnerID[i] == "com" || partnerID[i] == "gov" || partnerID[i] == "net" || partnerID[i] == "org" || partnerID[i] == "co") {
                combinedID.push(partnerID[i]);
            } else {
                domainRegisters.push(partnerID[i]);
            }
        }
        partner_id = domainRegisters.join('-') + "." + combinedID.join('.');
      }

        var fullUrl = GlobalSettings.getPartnerApiUrl(partner_id);
        return this.http.get(fullUrl)
            .map(
              res => res.json()
            )
            .flatMap(
            data => {
                if (data['results'] != null) {
                    let partnerScript = data['results'].header.script;
                    let partnerHeight = data['results'].header.height;
                    let partnerLocation = data['results']['location']['realestate']['location']['city'][0];
                    if (!this.geoData) {
                        this.geoData = {};
                    }
                    this.geoData['partner_id'] = partner_id;
                    this.geoData['partner_script'] = partnerScript;
                    this.geoData['height'] = partnerHeight;
                    // if (partnerLocation.state && partnerLocation.city) {
                        this.geoData['state'] = partnerLocation.state;
                        this.geoData['city'] = partnerLocation.city;
                        return this.getGeoLocation();

                        // return new Observable(observer => {
                        //     observer.next(this.geoData);
                        //     observer.complete();
                        // });
                    // }
                }
                // return data;
            }
            )
            .share();
    };

    //api to get geo location
    getGeoLocation() {
        var getGeoLocation = GlobalSettings.getGeoLocation() + '/listhuv/?action=get_remote_addr2';
        return this.http.get(getGeoLocation)
            .map(
              res => res.json()
            )
            .map(
            data => {
                data[0].state = data[0].state == null ? "us" : data[0].state;
                let state = data[0].state.toLowerCase();
                let city = data[0].city.replace(/ /g, "%20");
                let zipcode = data[0].zipcode;
                if (!this.geoData) {
                    this.geoData = {};
                }
                this.geoData['userState'] = state;
                this.geoData['userCity'] = city;
                this.geoData['userZipcode'] = zipcode;
                return this.geoData;
            })
            .share();
    };

    grabLocation(partnerID?: string) {
        if (this.geoData) {
            return new Observable(observer => {
                observer.next(this.geoData);
                observer.complete();
            });
        } else if (this.geoObservable) {
            return this.geoObservable;
        } else {
            if (partnerID) {
                this.geoObservable = this.getPartnerData(partnerID);
            } else {
                this.geoObservable = this.getGeoLocation();
            }
            return this.geoObservable;
        }
    };
}

@Injectable()

export class listViewPage {
  public protocolToUse: string = (location.protocol == "https:") ? "https" : "http";
  public apiUrl: string = GlobalSettings.getApiUrl();

  constructor(public http: Http, private globalFunctions: GlobalFunctions) {}

  //API for listview page data
  getListData(listname, state, city, limit, page, sort) {
    if ( /-/.exec(listname) ) {
      //only reformat if listname is actually in kabab case, as it will change camelCase to lowercase
      listname = this.globalFunctions.kababCaseToCamelCase(listname);
    }

    var query:any  = {
      listname: listname,
      state: state,
      city: city,
      zip: 'empty',
      limit: limit,
      page: page,
    };

    if(sort !== null){
      query.sort = sort;
    }
    var fullUrl = this.apiUrl +"/list";

    //list/homesAtLeast5YearsOld/KS/Wichita/empty/10/1
    for (var q in query) {
      if (query[q] == 'Null' || query[q] == null || query[q] == 'empty') {
        query[q] = '/empty';
      } else {
        query[q] = '/' + query[q];
      }
      if (query[q] == '' || typeof query[q] != 'undefined') {

      }
      fullUrl += query[q];
    }

    return this.http.get(fullUrl, {
    })
      .map(
      res => res.json()
      )
      .map(
      data => {
        return data;
      }
      )
  }

  //API for Find Your Home filtered call
  getFindYourHome(state, city, priceLowerBound, priceUpperBound, type, bedrooms, bathrooms, squareFeet, lotSize, limit, page) {

    city = encodeURI(city);
    state = encodeURI(state);

    var fullUrl = this.apiUrl

    // location/findYourHome/{state}/{city}/{priceLowerBound}/{priceUpperBound}/{type}/{bedrooms}/{bathrooms}/{squareFeet}/{lotSize}/{limit}/{page}
    // types: Townhouse, Condominium, Apartment, and Single Family Attached
    return this.http.get(fullUrl + '/location/findYourHome/' + state + '/' + city + '/' + priceLowerBound + '/' + priceUpperBound + '/'  + type + '/' + bedrooms + '/' + bathrooms + '/' + squareFeet + '/' + lotSize + '/' + limit + '/' + page)
        .map(
            res => res.json()
        )
        .map(
            data => {
              return data;
            }
        )
  }
}

@Injectable()
export class ListOfListPage {

  constructor(public http: Http, private _globalFunctions: GlobalFunctions) { }

  public apiUrl: string = GlobalSettings.getApiUrl();

  getAddressListOfListPage(address){
    address = encodeURIComponent(address);

    return this.http.get(this.apiUrl + '/list/listOfListsAddressKey/' + address)
      .map(
          res => res.json()
      )
    .map(
        data => {
          return data.data;
        }
    )
  }

  getListOfListPage(state, city) {
    city = this._globalFunctions.toTitleCase(city.replace(/-/g, ' '));
    state = state.toUpperCase();

    //Nearby Cities call (Returns city, state, distance)
    return this.http.get(this.apiUrl + '/list/listOfLists/' + state + '/' + city)
      .map(
      res => res.json()
      )
      .map(
      data => {
        return data.data;
      }
      )
  }

  getListOfListPageState(state) {
    state = state.toUpperCase();

    //Nearby Cities call (Returns city, state, distance)
    return this.http.get(this.apiUrl + '/list/listOfLists/' + state)
        .map(
            res => res.json()
        )
        .map(
            data => {
              return data.data;
            }
        )
  }
}

@Injectable()

export class GlobalPage {
  public apiUrl: string = GlobalSettings.getApiUrl();

  constructor(public http: Http){}
  //Function to set custom headers

  getAboutUsData() {
    return this.http.get(this.apiUrl + '/aboutUs')
      .map(
      res => res.json()
      )
      .map(
      data => {
        return data.data;
      }
      )
  }
}

@Injectable()

export class DynamicWidgetCall {
  /* you can replace apis with this proper call please test before you do
  public apiUrl: string = GlobalSettings.getDynamicUrl + "/list_creator_api.php";
  public apiCountyUrl: string = GlobalSettings.getDynamicUrl + "/ajc_list_api.php";
  */
  public apiUrl: string = "http://dev-dw.synapsys.us/list_creator_api.php";
  public apiCountyUrl: string = "http://dev-dw.synapsys.us/ajc_list_api.php";

  constructor(public http: Http) {
    if (GlobalSettings.isProd()) {
      this.apiUrl = "http://dw.synapsys.us/list_creator_api.php";
      this.apiCountyUrl = "http://dw.synapsys.us/ajc_list_api.php"
    }
  }
  //Function to set custom headers

  // Method to get data for the list for the dynamic widget
  getWidgetData(tw, sw, input) {
    // Inputs: tw - trigger word, sw - sort parameter, input - input value
    // If value is not needed, pass -1

    // Return error if no tw
    // if (typeof (tw) == "undefined") {
    //   return {
    //     "success": false,
    //     "message": "Error: Trigger word is required"
    //   };
    // }

    // Set defaults
    if (typeof (sw) == "undefined") {
      sw = -1;
    }
    if (typeof (input) == "undefined") {
      input = -1;
    }

    // Build the URL
    var url = this.apiUrl + "?tw=" + tw + "&sw=" + sw + "&input=" + input;

    // Build a key for logging
    var key = tw + ":" + sw + ":" + input;

    // Options array (unzip gzip response)
    var opts = {
      npmRequestOptions: {
        gzip: true
      }
    };

    return this.http.get(url, {
    })
      .map(
      res => res.json()
      )
      .map(
      data => {
        return data;
      },
      err =>{
        return err;
      }
  )
  }

  // Method to get data for the list for the dynamic county widget
  getCountyWidgetData(category, location, metro, rand) {

    // Build the URL
    var url = this.apiCountyUrl + "?list=true";
    url += category.length ? "&category=" + category : "&category=demographics";
    url += location.length ? "&location=" + location : "";
    url += metro.length ? "&metro=" + metro : "";
    url += rand.length ? "&rand=" + rand : "&rand=1";

    return this.http.get(url, {
    })
      .map(
      res => res.json()
      )
      .map(
      data => {
        return data;
      },
      err =>{
        return err;
      }
  )
  }
}
