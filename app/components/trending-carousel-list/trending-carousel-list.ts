import {Component, Input, OnInit} from 'angular2/core';
import {moduleHeader} from "../../components/module-header/module-header";

@Component({
    selector: 'trending-carousel-list',
    templateUrl: './app/components/trending-carousel-list/trending-carousel-list.html',
    
    directives: [moduleHeader],
    providers: [],
})

export class trendingCarousel implements OnInit{
    module_title: string;
    public mod_title = '[Profile Name]\'s [Module Title]';
    @Input() tcl;

    dummyData(){

    }
    ngOnInit(){
        this.dummyData();
        this.module_title = this.mod_title;
        // console.log(this);
    }
}
