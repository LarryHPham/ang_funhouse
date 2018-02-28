import {Component, Input, OnInit} from 'angular2/core';
import {Image180} from "../images/image-180.component";
import {List} from "../../global/global-interface";
import {ROUTER_DIRECTIVES} from "angular2/router";

@Component({
    selector: 'list-carousel-component',
    templateUrl: './app/components/list-carousel/list-carousel.component.html',
    
    directives: [Image180, ROUTER_DIRECTIVES],
    providers: [],
    inputs: ['lists', 'stateLocation', 'cityLocation', 'isStateOnly'],
})

export class ListCarouselComponent implements OnInit {
    public icon: string;
    public title: string;
    public description: string;
    public cityLocation: string;
    public stateLocation: string;
    public isStateOnly: boolean;
    public main_hasSubImg: boolean = false;
    location: string;
    lists: any;

    // Carousel setup
    carCount: number;
    length: number;

    setStaticData(){
        this.icon = 'fa fa-home';
        this.location = '[Location]'
    }

    clickLeft() {
        this.carCount = this.carCount - 1;
        if (this.carCount < 0) {
            this.carCount = this.length - 1;
        }
    }

    clickRight() {
        this.carCount = this.carCount + 1;
        if (this.carCount >= this.length) {
            this.carCount = 0;
        }
    }

    ngOnInit(){
        this.length = this.lists.length;
        this.carCount = 0;
        this.setStaticData();
    }
}