import {Component, OnInit, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';
import {CircleButton} from "../buttons/circle/circle.button";

import {PriceFormatPipe} from '../../pipes/price-format.pipe';

@Component({
    selector: 'photo-list',
    templateUrl: './app/components/photo-list/photo-list.component.html',
    
    directives: [CircleButton, ROUTER_DIRECTIVES],
    providers: [],
    inputs: ['listData', 'carouselData'],
    pipes: [PriceFormatPipe]
})

export class PhotoListComponent implements OnInit{
    buttonName: string;
    infoList: any;
    listData: any;
    carouselData: any; //array of images for carousel to be used for imageData
    imageCounter: number = 0;
    imageData: any; //main photo image being displayed

    newCarousel(index){
      this.imageData = this.carouselData[index];
    }

    left(){
      //make a check to see if the obj array is below 0 change the obj array to the top level
      if(this.imageCounter == 0){
        //makes sure to change to new obj before checking the length to know what position the array should be starting at
        this.imageCounter = (this.carouselData.length - 1);
      }else{
        this.imageCounter--;
      }
      //run the changeMain function to change the main image once a new array has been established
      this.newCarousel(this.imageCounter);
    }

    right(){
      //check to see if the end of the obj array of images has reached the end and will go on the the next obj with new set of array
      if(this.imageCounter == (this.carouselData.length - 1)){
        this.imageCounter = 0;
        //if the obj array is at the end then restart by setting the object counter back to 0
      }else{
        this.imageCounter++;
      }
      //run the changeMain function to change the main image once a new array has been established
      this.newCarousel(this.imageCounter);
    }
    //makes sure to show first image and run the modifyMedia function once data has been established
    ngOnChanges(){
      if(typeof this.carouselData != 'undefined'){
        //if data coming from module to variable mediaImages changes in what way then reset to first image and rerun function
        this.newCarousel(this.imageCounter);
      }
    }
    ngOnInit(){

    }
}
