/**
 * Created by Larry on 2/23/2016.
 */
import {Component, Input, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from "angular2/router";

@Component({
    selector: 'module-footer',
    templateUrl: './app/components/module-footer/module-footer.html',
    
    directives:[ROUTER_DIRECTIVES],
    providers: [],
    inputs:['data']
})

export class moduleFooter{
  data:any;

  ngOnInit(){
  }
}
