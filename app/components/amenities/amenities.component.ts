/**
 * Created by Victoria on 3/10/2016.
 */
import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';
import {Image150} from '../../components/images/image-150.component';
import {CarouselButton} from '../../components/buttons/carousel/carousel.button';
import {Router,ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'amenities-component',
    templateUrl: './app/components/amenities/amenities.component.html',
    
    directives: [Image150, CarouselButton, ROUTER_DIRECTIVES],
    inputs: ['list_data', 'hasFooterButton'],
    outputs: ['scrollRight', 'scrollLeft']
})

export class AmenitiesComponent implements OnInit{
    public main_hasSubImg: boolean;
    list_data: Object;
    listView: Object;
    public scrollRight: EventEmitter<boolean> = new EventEmitter();
    public scrollLeft: EventEmitter<boolean> = new EventEmitter();
    public imageLocationText = "On Yelp";

    left(){
        this.scrollLeft.next(true);
    }
    right(){
        this.scrollRight.next(true);
    }

    ngOnInit(){
      this.main_hasSubImg = false;
    }//end ngOnInit()
}
