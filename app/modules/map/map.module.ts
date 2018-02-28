import {Component, Input, OnInit} from 'angular2/core';
import {moduleHeader} from '../../components/module-header/module-header';
import {MapComponent} from '../../components/map/map.component';

declare var google:any;

@Component({
    selector: 'map-module',
    templateUrl: './app/modules/map/map.module.html',
    directives: [moduleHeader, MapComponent],
    providers: []
})

export class MapModule implements OnInit{
    public moduleTitle: string;
    @Input() mapData: Array<any>;
    @Input() addressObject: any;

    constructor(){}

    ngOnInit(){
        this.moduleTitle = 'Map of ' + this.addressObject.address + ', ' + this.addressObject.city + ', ' + this.addressObject.stateAP + ' and Its Surrounding Area';
    }
}
