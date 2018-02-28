import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from './global-settings';

@Injectable()

export class LocationProfileService{
    public apiUrl: string = GlobalSettings.getApiUrl();
    public apiToken: string = 'BApA7KEfj';
    public headerName: string = 'X-SNT-TOKEN';

    constructor(public http: Http, public globFunc: GlobalFunctions){

    }

    //Function to set custom headers
    setToken(){
        var headers = new Headers();
        //headers.append(this.headerName, this.apiToken);
        return headers;
    }

    getLocationFeaturedList(city, state, counter){
        //Configure HTTP Headers
        var headers = this.setToken();

        city = encodeURI(city);
        state = encodeURI(state);

        var list = this.globFunc.randomList();
        var random = Math.floor(Math.random() * list.length);
        var chosenList = list[random];

        return this.http.get(this.apiUrl + '/list/'+chosenList+'/' + state + '/' + city + '/empty/1/1', {
                headers: headers
            })
            .map(
                res => res.json()
            )
            .map(
                data => {
                  var returnData = {
                    listName: chosenList,
                    listData: data.data
                  }
                    return returnData;
                }
            )
    }

    getLocationProfile(city, state){
        //Configure HTTP Headers
        var headers = this.setToken();
        city = this.globFunc.toTitleCase(city);
        city = encodeURI(city);
        state = encodeURI(state);

        return this.http.get(this.apiUrl + '/location/profileHeader/' + state + '/' + city, {
                headers: headers
            })
            .map(
                res => res.json()
            )
            .map(
                data => {
                    if(data.success == false){
                        throw new Error('Error: getLocationProfile Header api success, message failed');
                    }

                    return data.data;
                }
            )
    }

    getCrime(city, state){
        //Configure HTTP Headers
        var headers = this.setToken();

        city = encodeURI(city);
        state = encodeURI(state);

        return this.http.get(this.apiUrl + '/location/crimeInLocation/' + state + '/' + city, {
            headers: headers
        })
        .map(
            res => res.json()
        )
        .map(
            data => {
                return data.data;
            }
        )
    }

    getRecentListings(city, state, counter) {
        //Configure HTTP Headers
        var headers = this.setToken();

        city = encodeURI(city);
        state = encodeURI(state);
        return this.http.get(this.apiUrl + '/list/listingsMostRecent/' + state + '/' + city + '/empty/4/'+counter, {
                headers: headers
            })
            .map(
                res => res.json()
            )
            .map(
                data => {
                    return data.data;
                }
            )
    }

      getSchoolData(city, state){
          //Configure HTTP Headers
          var headers = this.setToken();

          city = encodeURI(city);
          state = encodeURI(state);

          return this.http.get(this.apiUrl + '/location/schoolsInLocation/' + state + '/' + city, {
                  headers: headers
              })
              .map(
                  res => res.json()
              )
              .map(
                  data => {
                      return data.data;
                  }
              )
      }
      getAmenitiesData(city, state){
          //Configure HTTP Headers
          var headers = this.setToken();

          city = encodeURI(city);
          state = encodeURI(state);

          return this.http.get(this.apiUrl + '/location/amenitiesInLocation/' + state + '/' + city, {
                  headers: headers
              })
              .map(
                  res => res.json()
              )
              .map(
                  data => {
                      return data.data;
                  }
              )
      }
      getTrendingHomesData(city, state, counter){
          //Configure HTTP Headers
          var headers = this.setToken();

          city = encodeURI(city);
          state = encodeURI(state);

          var list = this.globFunc.randomList();
          var random = Math.floor(Math.random() * list.length);
          var chosenList = list[random];
          return this.http.get(this.apiUrl + '/list/'+chosenList+'/' + state + '/' + city + '/empty/1/'+ counter, {
                  headers: headers
              })
              .map(
                  res => res.json()
              )
              .map(
                  data => {
                    var returnData = {
                      listName: chosenList,
                      listData: data.data
                    }
                      return returnData;
                  }
              )
      }

}
