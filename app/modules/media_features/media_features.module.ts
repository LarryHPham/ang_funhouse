/**
 * Created by Victoria on 3/2/2016.
 */
import {Component, OnInit, Input, OnChanges} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {moduleHeader} from "../../components/module-header/module-header";
import {MediaImages} from "../../components/media-images/media-images.component";
import {PropertyListingInterface} from '../../global/global-interface';
import {GlobalFunctions} from '../../global/global-functions';
import {ListingProfileService} from '../../global/listing-profile.service';
declare var moment: any;

@Component({
  selector: 'media-features-module',
  templateUrl: './app/modules/media_features/media_features.module.html',

  directives: [moduleHeader, MediaImages],
  providers: [],
  inputs:['locData']
})

export class MediaFeatureModule implements OnInit {
  public locData:any;
  public moduleTitle: string;
  public trending: boolean;
  public prop_features: any;
  public profileType: string;
  public location: string;
  private propertyData: any;//data to send from module into components
  private date;
  expand: boolean = false; // for modal
  modal: boolean = true;
  lastUpdated = "";
  image_url = '/app/public/no_photo_images/onError.png';
  featureHeading = "Features Of This Property";
  lastUpdate = "";

  @Input() propertyListingData: PropertyListingInterface;

  constructor(private router: Router, private _params: RouteParams, private globalFunctions: GlobalFunctions, private _listingService: ListingProfileService) {
    //Determine what page the profile header module is on
    this.profileType = this.router.hostComponent.name;
  }

  getData() {
    this.propertyData = this._listingService.getPropertyListing(this._params.get('address'))
      .subscribe(data => {
        this.propertyData = this.dataFormatter(data);
    })
  }

  expandModal() {
    if (this.expand == true) {
      this.expand = false;
    } else {
      this.expand = true;
    }
    return this.expand;
  }

  dataFormatter(originalData) {
    this.location = this.globalFunctions.toTitleCase(originalData.address) + ', ' + this.globalFunctions.toTitleCase(originalData.city) + ', ' + this.globalFunctions.stateToAP(originalData.state);
    if (this.profileType === 'ProfilePage') {
      this.moduleTitle = 'Property Images, Media & Features for ' + this.location;
    }
    var featureHaves = [];
    var formattedDays = "N/A";
    for (var feature in originalData) {
      if (originalData[feature] == null || typeof originalData[feature] == 'undefined') {
        originalData[feature] = 'N/A';

      }
      if (feature != 'listingImages' && feature != 'imageCount' && feature != 'listingID' && originalData[feature] != "" && originalData[feature] != null) {
        //get the date
        if (feature == 'listingDate') {
          originalData[feature] = originalData[feature].split(' ')[0];
        }
        if(feature == 'hasBasement'){
          if(originalData[feature] != 'N/A'){
            originalData[feature] = 'Yes';
          } else {
            originalData[feature] = 'No';
          }
        }
        switch (feature) {
          //if feautre is any below do not push into featureHaves array
          case 'city':
          case 'state':
          case 'zipCode':
          case 'address':
            originalData['address'] = this.globalFunctions.toTitleCase(originalData['address']);
            break;
          case 'daysOnMarket':
            formattedDays = this.globalFunctions.formatDaysOnMarket(originalData.daysOnMarket);
            break;
          case 'listingDate':
            originalData['listingDate'] = originalData['listingDate'].split(' ')[0];
          //below just modify and then go to default as well
          case 'squareFeet':
            originalData['squareFeet'] = this.globalFunctions.commaSeparateNumber(originalData['squareFeet']);
          case 'listPrice':
            originalData['listPrice'] = this.globalFunctions.commaSeparateNumber(originalData['listPrice']);
          default:
            featureHaves.push({
              featureName: this.featureProperty(feature),
              featureValue: originalData[feature]
            });
            break;
        }
      }//end if
    }//end for loop

    if (originalData.listingImages === null || originalData.listingImages == '' || typeof originalData.listingImages == 'undefined') {
      originalData.listingImages = [this.image_url];
    }

    //grab featured data about listing
    if(typeof originalData.virtualTour == 'undefined'){
      originalData.virtualTour = 'N/A';
    }
    var featureListing = {
      city: originalData.city,
      state: originalData.state,
      daysOnMarket: formattedDays,
      price: originalData.listPrice,
      priceName: 'Sale Price',
      detail1: this.globalFunctions.commaSeparateNumber(originalData['squareFeet']),
      unit1: 'Sq Ft',
      detail2: originalData.lotSize,
      unit2: 'Acres',
      zipCode: originalData.zipCode,
      address: originalData.address,
      locUrl1: "Location-page",
      locUrl2: { loc: this.globalFunctions.toLowerKebab(originalData.city) + '-' + originalData.state.toLowerCase() },
      virtualTour: originalData.virtualTour,
    };
    return {
      imageArray: originalData.listingImages,
      featureData: featureHaves,
      featureListing: featureListing,
    }
  }//end of dataFormatter

  featureProperty(name) {
    var featureProp = {
      daysOnMarket: 'Days On Market',
      listPrice: 'Price',
      squareFeet: 'Square Feet',
      lotSize: 'Lot Size',
      listingDate: 'Listing Date',
      address: 'Address',
      zipCode: 'Zipe Code',
      city: 'City',
      state: 'State',
      numBathrooms: 'Bathrooms',
      fullBathrooms: 'Full Bathrooms',
      halfBathrooms: 'Half Bathrooms',
      numBedrooms: 'Bedrooms',
      hasBasement: 'Basement',
      roof: 'Roof',
      heatingFuel: 'Heating Fuel',
      architecturalStyle: 'Architectural Style',
      heating: 'Heating',
      cooling: 'Cooling',
      numFloors: 'Num. of Floors',
      exterior: 'Exterior',
      parking: 'Parking',
      view: 'View',
      floor: 'Floor',
      appliance: 'Appliances'
    };
    return featureProp[name];
  }

  ngOnInit() {
    this.trending = false;
    this.getData();
  }

  //On Change Call
  ngOnChanges(event) {
    //Get changed input
    var currentPropertyListingData = event.propertyListingData.currentValue;
    //If the data input is valid run transform data function
    if (currentPropertyListingData !== null && currentPropertyListingData !== false) {
      this.getData();
    }
  }
}
