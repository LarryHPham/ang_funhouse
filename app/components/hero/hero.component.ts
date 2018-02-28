import {Component, Input} from 'angular2/core';
import {HeroSearchComponent} from "./hero-search/hero-search.component";

@Component({
    selector: 'hero-component',
    templateUrl: './app/components/hero/hero.component.html',

    directives: [HeroSearchComponent],
    providers: [],
})

export class HeroComponent{
  @Input() geoData: any;
  @Input() cityLocation: any;
  @Input() stateLocation: any;
}
