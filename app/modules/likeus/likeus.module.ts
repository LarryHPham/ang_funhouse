/**
 * Created by Victoria on 3/7/2016.
 */
import {Component, OnInit} from 'angular2/core';
import {moduleHeader} from "../../components/module-header/module-header";

@Component({
    selector: 'like-us-module',
    templateUrl: './app/modules/likeus/likeus.module.html',
    
    directives: [moduleHeader],
})
export class LikeUs implements OnInit{
    module_title: string = 'Like JoyfulHome on Facebook';
    
    ngOnInit() {      
        var d = document;
        var id = "facebook-jssdk";
        var s = "script";
        var fbs = d.getElementById(id);
        
        //remove any existing FB element;
        if (fbs) {
          fbs.parentNode.removeChild(fbs); 
        }
        window['FB'] = undefined; 
        
        var js, fjs = d.getElementsByTagName(s)[0];
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5";
        fjs.parentNode.insertBefore(js, fjs);
    }
}