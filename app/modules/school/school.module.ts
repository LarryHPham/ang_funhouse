/**
 * Created by Victoria on 3/10/2016.
 */
import {Component, OnInit, Input, OnChanges} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {GlobalFunctions} from '../../global/global-functions';
import {SchoolDataInterface} from '../../global/global-interface';

import {moduleHeader} from '../../components/module-header/module-header';
import {TilesComponent} from '../../components/tiles/tiles.component';
import {AmenitiesComponent} from '../../components/amenities/amenities.component';

@Component({
    selector: 'school-module',
    templateUrl: './app/modules/school/school.module.html',

    directives: [moduleHeader, TilesComponent, AmenitiesComponent],
    providers: [],
    inputs:['locData']
})
export class SchoolModule implements OnInit{
    public locData:any;
    public hasFooterButton: boolean;
    public listData: Object;
    public listView: Object;
    public tileData: Object;
    public index: number = 0;
    public moduleTitle: string;
    public profileType: string;
    public location: string;
    public allSchool: Array<any> = [];
    @Input() schoolData: any;

    constructor(private router: Router, private _params: RouteParams, private globalFunctions: GlobalFunctions){
      this.profileType = this.router.hostComponent.name;
    }

    left(){
        if(this.schoolData === null){
            return false;
        }

        var max = this.allSchool.length - 1;

        if(this.index > 0){
            this.index -= 1;
            this.dataFormatter();
        }else{
            this.index = max;
            this.dataFormatter();
        }
    }
    right(){
        if(this.schoolData === null){
            return false;
        }

        var max = this.allSchool.length - 1;

        if(this.index < max){
            this.index += 1;
            this.dataFormatter();
        }else{
            this.index = 0;
            this.dataFormatter();
        }
    }

    dataFormatter(){
      var data = this.schoolData;
      if ( data === undefined || data === null ) {
        return;
      }
      
      if(data.elementary.length === 0){
          return false;
      }
      var schoolData = data['meta'];
      this.location = schoolData.city + ', ' + this.globalFunctions.stateToAP(schoolData.state);

      var allSchool = [];
      for(var obj in data){
        if(obj != 'meta'){
          data[obj].forEach(function(item){
            item.schoolType = obj;//return type of school into array
            allSchool.push(item);
          })
        }
      }
      this.allSchool = allSchool;
      var allSchoolData = allSchool[this.index];
      var schoolName =  this.globalFunctions.toTitleCase(allSchoolData.school_name);
      schoolName = schoolName.replace("Elementary", "Elem");
      schoolName = schoolName.replace("Elem", "Elementary");

      var paramState = schoolData.state.toLowerCase();
      var paramCity = this.globalFunctions.toLowerKebab(schoolData.city);

      this.listData = {
        hasHoverNoSubImg: false,
        header: "What Schools are in the Area?",
        name: this.location,
        establishment:  schoolName,
        address: allSchoolData.type,
        imageUrl: schoolData.locationImage,
        url: 'School-lists-page',
        paramOptions: {
                    listname: allSchoolData.schoolType,
                    city: paramCity,
                    state: paramState
                  },
        listView: [
          {
            icons: 'fa-pencil',
            category: "Elementary Schools",
            count: schoolData.elementaryCount + " near this listing",
            url: 'School-lists-page',
            paramOptions: {
                        listname: 'elementary',
                        city: paramCity,
                        state: paramState
                      },
            viewMore: "See All"
          },
          {
            icons: 'fa-child',
            category: "Middle Schools",
            count: schoolData.middleCount + " near this listing",
            url: 'School-lists-page',
            paramOptions: {
                        listname: 'middle',
                        city: paramCity,
                        state: paramState
                      },
            viewMore: "See All"
          },
          {
            icons: 'fa-graduation-cap',
            category: "High Schools",
            count: schoolData.highCount + " near this listing",
            url: 'School-lists-page',
            paramOptions: {
                        listname: 'high',
                        city: paramCity,
                        state: paramState
                      },
            viewMore: "See All"
          }
        ]
      }//listData ends

      // get data for tiles
      this.tileData = {
          button_txt: 'Open Page',
          url1: 'School-lists-page',
          paramOptions1: {
                      listname: 'elementary',
                      city: paramCity,
                      state: paramState
                    },
          icon1: 'fa-pencil',
          title1: 'Elementary Schools',
          desc1: '',

          url2: 'School-lists-page',
          paramOptions2: {
                      listname: 'middle',
                      city: paramCity,
                      state: paramState
                    },
          icon2: 'fa-child',
          title2: 'Middle Schools',
          desc2: '',

          url3: 'School-lists-page',
          paramOptions3: {
                      listname: 'high',
                      city: paramCity,
                      state: paramState
                    },
          icon3: 'fa-graduation-cap',
          title3: 'High Schools',
          desc3: ''
      }

    }//dataFormatter ends

    ngOnInit(){
      // this.setModuleTitle();
      this.hasFooterButton = false;
      if(this.profileType === 'LocationPage'){
          this.moduleTitle = 'Schools in ' + this.location;
      }
    }// end ngOnInit

    //On Change Call
    ngOnChanges(event){
      if(typeof event.schoolData != 'undefined'){
        //Get changed input
        var currentSchoolData = event.schoolData.currentValue;
        //If the data input is valid run transform data function
        if(currentSchoolData !== null && currentSchoolData !== false){
          // Perform try catch to make sure module doesnt break page
          try{
            //If featured list data has no list data (length of 0) throw error to hide module
            if(this.schoolData.elementary.length === 0){
              throw 'No Data available for school list - hiding module';
            }
            this.dataFormatter();
          }catch(e){
            console.log('Error - School List Module ', e);
            this.schoolData = undefined;
          }
          this.dataFormatter();
        }//end of null check
      }//end of event check
    }// end On Change Call
}
