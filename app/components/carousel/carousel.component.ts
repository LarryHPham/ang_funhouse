/**
 * Created by Victoria on 2/18/2016.
 */
import {Component} from 'angular2/core';
import {CarouselButton} from "../buttons/carousel/carousel.button.ts";
@Component({
    selector: 'carousel-component',
    templateUrl: './app/components/buttons/carousel.button.html',
    
    directives: [CarouselButton]
})
export class CarouselComponent{
    text1 = "Lorem ipsum dolor sit amet";
    text2 = "Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet";
    image_url = '/app/public/img_bckgnd.png';
}
