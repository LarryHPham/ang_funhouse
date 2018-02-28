import {Component, Input} from 'angular2/core';

@Component({
    selector: 'explore-button-component',
    templateUrl: './app/components/buttons/explore-button/explore-button.component.html',
    
    inputs: ['buttonTitle', 'buttonWidth', 'buttonIcon'],
    directives: [],
    providers: []
})

export class ExploreButtonComponent{
    public buttonTitle: string;
    public buttonWidth: number;
    public buttonIcon: string;
}