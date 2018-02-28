import {Component, Input} from 'angular2/core';
import {AdzoneComponent} from "../../../components/magazine/mag-adzone/mag-adzone.component";
import {LearnMoreComponent} from "../../../components/magazine/mag-btns/learnmore-btn/learnmore-btn.component";

@Component({
    selector: 'magazine-amenities-text-module',
    templateUrl: './app/modules/magazine/mag-amenities-text/mag-amenities-text.module.html',
    
    directives: [AdzoneComponent, LearnMoreComponent],
    inputs: ['magAmenities', 'hasImage'],
})

export class MagAmenitiesTextModule{
}