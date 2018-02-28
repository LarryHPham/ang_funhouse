import {Component} from 'angular2/core';
import {HeroSearchComponent} from "../hero-search/hero-search.component";

@Component({
    selector: 'hero-list-component',
    templateUrl: './app/components/hero/hero-list/hero-list.component.html',
    
    directives: [HeroSearchComponent],
    providers: [],
})

export class HeroListComponent{
    heroListTitle: string = "Discover Your Next Home";
    heroListSubTitle: string = "Get all the details you need to plan your future.";
}