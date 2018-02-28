import {Component, Input, OnChanges} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'search-results',
    templateUrl: './app/components/search-results/search-results.component.html',

    directives: [ROUTER_DIRECTIVES],
    providers: [],
    inputs: ['searchResults', 'showResults', 'term']
})

export class SearchResults{
    showResults: boolean;
    noResultsFound: boolean;
    searchResults: Array<Object>;
    firstItemHover: number = 0;
    term: any;

    constructor(private _router: Router){
    }

    closeResults(event){
        this.showResults = false;
    }

    relatedResults(event){
      var value = this.term._value;
      if(typeof value === 'undefined' || value === '' || value === null){
          return false;
      }
      value = value.replace(/ /g, '-');
      value = encodeURIComponent(value);
      this.term.updateValue('');
      this._router.navigate(['Search-page', {query: value}]);
      this.showResults = false;
    }

    ngOnChanges(event){
        //console.log('Lutz - search changes', event, this);
        if(typeof event.searchResults !== 'undefined'){
            var currentValue = event.searchResults.currentValue;
            var previousValue = event.searchResults.previousValue;

            //If returned result is an empty array, display no results found
            if(typeof currentValue !== 'undefined' && currentValue !== null && currentValue.length === 0){
                this.noResultsFound = true;
            }else{
                this.noResultsFound = false;
            }

            //Needed if user clicks on close button (input stays focused so extra typing does not cause dropdown to appear)
            if(JSON.stringify(currentValue) !== JSON.stringify(previousValue)){
                this.showResults = true;
            }
        }
    }
}
