import {Component, OnInit, Input} from 'angular2/core';
import {Router} from 'angular2/router';
import {GlobalFunctions} from '../../global/global-functions';

declare var google:any;

@Component({
    selector: 'map-component',
    templateUrl: './app/components/map/map.component.html',
    
    directives: [],
    providers: []
})

export class MapComponent implements OnInit{
    @Input() mapData: any;

    constructor(private globalFunctions: GlobalFunctions, private _router: Router){

    }

    ngOnInit(){
        this.drawMap();
    }

    drawMap(){
        var data = this.mapData;
        var geoDataFound = false;

        //Get Default Center of map. Iterate through data to find first listing with both latitude and longitude (This listing will be the center of the map)
        for(var i = 0; i < data.length; i++){
            if(data[i].latitude !== null && data[i].longitude !== null){
                var latLng = new google.maps.LatLng(parseFloat(data[i].latitude), parseFloat(data[i].longitude));
                var mapOptions = {
                    zoom: 11,
                    center: latLng
                };
                geoDataFound = true;
                break;
            }
        }

        //If no geo data is found exit the function
        if(geoDataFound === false){
            return false;
        }

        //Create Map
        var map = new google.maps.Map(document.getElementById("map-component"), mapOptions);
        //Define new info window
        var infoWindow = new google.maps.InfoWindow();
        var self = this;

        data.forEach(function(item, index){
            //Get object for home
            var homePosition = new google.maps.LatLng(Number(item.latitude), Number(item.longitude));

            //Create markers
            var marker = new google.maps.Marker({
                position: homePosition,
                map: map,
                title: item.fullStreetAddress + ', ' + item.loc + ' ' + item.postalCode,
                icon: '/app/public/icons/Icon_Home_Unselected.png'
            });

            var listingImage: any;
            //Get data to push to info window template (infoTemplate)
            if(typeof item.listingImage !== 'undefined' && item.listingImage !== null){
                listingImage = item.listingImage;
            }else if(typeof item.photos !== 'undefined' && item.photos !== null && item.photos.length !== 0){
                listingImage = item.photos[0];
            }else{
                listingImage = '/app/public/joyfulhome_house.png';
            }
            var lineOne = item.fullStreetAddress + ', ' + item.loc + ' ' + item.postalCode;
            var lineTwo = item.listPrice === null ? 'Listing Price N/A' : '$' + self.globalFunctions.commaSeparateNumber(item.listPrice);
            lineTwo = item.livingArea === null ? lineTwo : lineTwo + ' | ' + self.globalFunctions.commaSeparateNumber(item.livingArea) + ' sq. ft';

            var infoTemplate = '<div class="map-info-container">'
                + '<div class="map-info-image" style="background-image: url(\'' + listingImage +'\')"></div>'
                + '<span class="map-info-title">' + lineOne + '</span><br>'
                + lineTwo + '<br>'
                + '<a id="map-view-profile" class="map-info-link">View Profile</a>'
                + '</div>';

            //Add click event to markers
            google.maps.event.addListener(marker, 'click', function(){
                //Set info window template to info window
                infoWindow.setContent(infoTemplate);
                infoWindow.open(map, marker);

                //Clear previous events from infoWindow
                google.maps.event.clearListeners(infoWindow);
                //Add click event to view profile text in infoWindow
                google.maps.event.addListener(infoWindow, 'domready', function(){
                    document.getElementById('map-view-profile').addEventListener('click', function(){
                        self._router.navigate(['../../Magazine', {addr: item.addressKey}, 'PropertyOverview']);
                    })
                })
            });

        });
    }
}