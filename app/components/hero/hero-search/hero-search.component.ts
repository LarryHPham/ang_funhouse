import {Component, Input} from 'angular2/core';
import {SearchService} from '../../../global/search-service';
import {SearchResults} from '../../search-results/search-results.component';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {listViewPage} from '../../../global/global-service';

import {Observable} from 'rxjs/Rx';
import {Control} from 'angular2/common';
//Currently Uneeded dependencies since full rxjs library is being pulled in with import {Observable} from 'rxjs/Rx'
//Go back later and pick modular dependencies
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/debounceTime';
//import 'rxjs/add/operator/distinctUntilChanged';
//import 'rxjs/add/operator/switchMap';
//import 'rxjs/add/operator/of';

@Component({
    selector: 'hero-search-component',
    templateUrl: './app/components/hero/hero-search/hero-search.component.html',

    directives: [SearchResults, ROUTER_DIRECTIVES],
    providers: [SearchService, listViewPage],
})

export class HeroSearchComponent{
    searchResults: Array<Object>;
    showResults: boolean;
    subscription: any;
    mlsError: any;
    mlsNearbyColumn1: Array<any> = [];
    mlsNearbyColumn2: Array<any> = [];
    term:any = new Control();
    @Input() placeholder:string;
    states: Array<any> = [
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arizona', 'AZ'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];
    hardCities: Array<any> = [
        ['new york', 'york', 'NY'],
        ['san francisco', 'francisco', 'CA'],
        ['san bernardino', 'bernardino',  'CA'],
        ['los angeles', 'angeles',  'CA'],
        ['san deigo', 'deigo',  'CA'],
        ['san jose', 'jose',  'CA'],
        ['long beach', 'beach',  'CA'],
        ['santa ana', 'ana',  'CA'],
        ['fort worth', 'worth',  'TX'],
        ['san antonio', 'antonio',  'TX'],
        ['corpus christi', 'christi',  'TX'],
        ['little rock', 'rock',  'AR'],
        ['des moines', 'moines',  'IA'],
        ['baton rouge', 'rouge',  'LA'],
        ['santa fe', 'fe',  'NM'],
        ['las vegas', 'vegas',  'NV'],
        ['virginia beach', 'beach',  'VA'],
        ['colorado springs', 'springs',  'CO'],
        ['new orleans', 'orleans',  'LA'],
        ['st paul', 'paul',  'MN'],
        ['fort wayne', 'wayne',  'IN'],
        ['chula vista', 'vista',  'CA'],
        ['st petersburg', 'petersburg',  'FL'],
        ['winston salem', 'salem',  'NC'],
        ['gilbert town', 'town',  'AZ']
    ];
    @Input() geoData: any;
    @Input() cityLocation: any;
    @Input() stateLocation: any;

    constructor(private _searchService: SearchService, private _router: Router, private listViewData: listViewPage){
        this.initializeSearch();
    }

    ngOnInit() {
    }

    setMLS(inCity?, inState?) {
      //list/homesAtLeast5YearsOld/KS/Wichita/empty/10/1
      var state = "CA"
      var city = "los%20angeles"
      if (inCity && inState) {
        city = inCity.replace(/-/g, "%20");
        state = inState;
      }
      else if (this.geoData) {
        if (this.geoData.stateUrl != null && this.geoData.cityUrl != null) {
          state = this.geoData.stateUrl;
          city = this.geoData.cityUrl.replace(/-/g, "%20");
        }
      }
      this.listViewData.getListData("homesAtLeast5YearsOld", state, city, "10", "1", "empty")
          .subscribe(
              data => {
                this.mlsNearbyColumn1 = [];
                this.mlsNearbyColumn2 = [];
                if (!data.data || data.data.length == 0) {
                  this.setMLS();
                }
                else {
                    for (var i = 0; i < data.data.length && i < 5; i++) {
                      this.mlsNearbyColumn1.push(data.data[i]);
                    }
                    for (var i = 5; i < data.data.length; i++) {
                      this.mlsNearbyColumn2.push(data.data[i]);
                    }
                  }
              },
              err => {
                  console.log('Error: Non Filter List API: ', err);
              }
          );
    }
    //Function to initialize search observable
    initializeSearch(){
        var self = this;
        //Function chain to pull api data for search
        //.debounceTime - only fire following function calls after 400 milliseconds after user input is done
        //.distinctUntilChanged - Ensures that api is not hit twice with the same parameters. This could happen if a person types 'car' in the input -> gets a result -> types 'cart' -> backspaces to 'car' (before the debounce time), the previous parameter was zoo and the new parameter hasnt changed therefore no new api call is needed
        //.switchMap - Ensures that api calls are in order. If a new api call is fired before the previous call finishes, the previous call is cancelled. Also in this case if the input is of length 0 then the api call is ignored and undefined is passed to search results
        //.subscribe - Assign result data to variable
        this.subscription = this.term.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .switchMap((term: string) => term.length > 0 ? this._searchService.getSearchResults(term, 'list') : Observable.of(undefined))
            .subscribe(
                (data: Array<Object>) => {
                    //If data is not undefined map through results and modify data
                    if(typeof data !== 'undefined') {
                        data = this.addRoutingParams(data);
                    }
                    this.searchResults = data;
                },
                err => {
                    //Unsubscribe if api fails. (It appears the observable is destroyed on error. This is just extra clean up just in case)
                    self.subscription.unsubscribe();
                    //Reinitialize search functionality
                    this.initializeSearch();
                }
            )
    }

    //Function to modify routing parameters (pick between magazine and listing profile)
    addRoutingParams(data){
        data.map(function(item, index){
            //Only modify parameters if the item is an address search result
            if(typeof item.address_key !== 'undefined'){
                if (item.property_type === 'Residential') {
                    item.page = '../../Magazine';
                    item.params = {
                        addr: item.address_key
                    };
                } else {
                    item.page = 'Profile-page';
                    item.params = {
                        address: item.address_key
                    };
                }
            }

            return item;
        });

        return data;
    }

    //Function to submit form to navigate to results page
    onSubmit(event){
        if (this.searchResults) {
          var value = this.term._value;
          if(typeof value === 'undefined' || value === '' || value === null){
              return false;
          }
          value = value.replace(/ /g, '-');

          value = encodeURIComponent(value);
          //Cancel previous call by passing empty string to the observable
          this.term.updateValue('');
          //Navigate to search page with query string
          this._router.navigate(['Search-page', {query: value}]);
        }
        else if (this.term._value) {
          var value = this.term._value.replace(/^a-zA-Z\d\s/g, '').toLowerCase();
          var state;
          var city;
          for (var i = 0; i < this.states.length; i++) {
            if (value.includes(" " + this.states[i][0].toLowerCase())) {
              state = this.states[i][0];
              var regex = RegExp("(?:\\\S+\\\s)" + state.toLowerCase());
              city = value.match(regex)[0].replace(state.toLowerCase(),"");
              for (var ind = 0; ind < this.hardCities.length; ind++) {
                if (value.includes(this.hardCities[ind][1]) && state == this.hardCities[ind][2]) {
                  city = this.hardCities[ind][0];
                }
              }
              this.setMLS(city, this.states[i][1]);
            }
            else if (value.includes(" " + this.states[i][1].toLowerCase())) {
              state = this.states[i][1];
              var regex = RegExp("(?:\\\S+\\\s)" + state.toLowerCase());
              city = value.match(regex)[0].replace(state.toLowerCase(),"");
              for (var ind = 0; ind < this.hardCities.length; ind++) {
                if (value.includes(this.hardCities[ind][1]) && state == this.hardCities[ind][2]) {
                  city = this.hardCities[ind][0];
                }
              }
              this.setMLS(city, state);
            }
          }
          this.mlsError = true;
        }
        else {
          this.setMLS();
          this.mlsError = true;
        }
    }

    //Function to tell search results component to show when input is focused
    focusResults(event){
        this.showResults = true;
    }

    //Function to tell search results component to hide when input is blurred
    blurResults(event){
        this.showResults = false;
    }

    //Function to fire search api
    searchText(event){
        var input = event.target.value;
        this.showResults = true;
        if(input === ''){
            this.showResults = false;
            this.searchResults = undefined;
            return false;
        }
    }

    //Function to prevent blur from happening when user clicks on dropdown. (search results component) This is so the anchor tag links can navigate properly
    preventBlur(){
        return false;
    }
}
