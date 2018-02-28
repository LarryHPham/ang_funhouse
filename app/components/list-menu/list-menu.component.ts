import {Component, Output, EventEmitter} from 'angular2/core';

@Component({
    selector: 'list-menu-component',
    templateUrl: './app/components/list-menu/list-menu.component.html',
    
    directives: [],
    outputs: ['menu']
})
export class ListMenuComponent{
public menu: EventEmitter<string> = new EventEmitter();
  listMenu(event){
    var id = event.target.id;
    return this.menu.next(id);
  }
}
