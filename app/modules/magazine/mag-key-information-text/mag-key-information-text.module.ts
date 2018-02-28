import {Component, Input} from 'angular2/core';
import {AdzoneComponent} from "../../../components/magazine/mag-adzone/mag-adzone.component";
import {LearnMoreComponent} from "../../../components/magazine/mag-btns/learnmore-btn/learnmore-btn.component";

@Component({
    selector: 'magazine-key-information-text-module',
    templateUrl: './app/modules/magazine/mag-key-information-text/mag-key-information-text.module.html',
    
    directives: [AdzoneComponent, LearnMoreComponent],
    inputs: ['magSchools', 'magDemographics', 'schoolImage', 'demographicImage'],
})

export class MagKeyInformationTextModule{
    public schoolImage: string;
    public demographicImage: string;
}