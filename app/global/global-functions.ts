import {Injectable} from 'angular2/core';

declare var moment: any;

@Injectable()

export class GlobalFunctions{
    //Transforms a string to titlecase
    toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };


    toCapititalization(str){
      //capitalizes first letter of each word of string
      var strMod = str.split('-').join(' ');
      return strMod.toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
      });
    }

    //Transforms a phone number to a human readable format
    //Formats
    // 10 character length (000) 000-0000
    // 7 character legnth 000-0000
    formatPhoneNumber(val) {
      if(isNaN(val) == false){
        var val = val.toString();
      }
        var numberLength = val.length;

        if(numberLength === 10){
            //Number with area code
            val = '(' + val.slice(0, 3) + ') ' + val.slice(3, 6) + '-' + val.slice(6, 10);
        }else if(numberLength === 7){
            //Number without area code
            val = val.slice(0, 3) + '-' + val.slice(3, 7);
        }

        return val;
    }
    formatGlobalDate(value,identifier){
      if(value == null || typeof value == 'undefined'){
        console.warn('formatGlobalDate() value is undefined. Defaulting to Todays Date');
        unixValue = moment(new Date()).unix() * 1000;
      } else {
        var unixValue = moment(value).unix();
      }
      if(unixValue.toString().length <= 11){
        unixValue = Number(unixValue) * 1000;
      } else {
        unixValue = Number(unixValue);
      }
      var newDate;
      var day = moment(unixValue).format('dddd');
      var shortDay = moment(unixValue).format('D');
      var monthnum = Number(moment(unixValue).format('M')) - 1;
      var month = GlobalFunctions.formatAPMonth(monthnum);
      var timeZone = moment(unixValue).tz('America/New_York').format('hh:mmA (z)');
      var shortDate = moment(unixValue).format('MM/DD/YY');
      var year = moment(unixValue).format('YYYY');
      switch(identifier) {
        case 'defaultDate':
          newDate = month + ' ' + shortDay + ', ' + year; // Oct. 03, 2006
          return newDate;
        case 'shortDate':
          newDate = shortDate; // 10/03/06
          return newDate;
        case 'timeZone':
          newDate = day + ', ' + month + ' ' + shortDay + ', ' + year + ' ' + timeZone; //Tuesday, Oct. 03, 2006 5:30:10PM (EDT)
          return newDate;
        case 'dayOfWeek':
          newDate = day + ', ' + month + ' ' + shortDay + ', ' + year; //Tuesday, Oct. 03, 2006
          return newDate;
        case 'time':
          newDate = timeZone;
          return newDate;
        default:
          return month + ' ' + day + ', ' + year;
      }
    }
    static formatAPMonth(month) {
      switch (month) {
        case 0: return "Jan.";
        case 1: return "Feb.";
        case 2: return "March";
        case 3: return "April";
        case 4: return "May";
        case 5: return "June";
        case 6: return "July";
        case 7: return "Aug.";
        case 8: return "Sept.";
        case 9: return "Oct.";
        case 10: return "Nov.";
        case 11: return "Dec.";
        default: return "";
      }
   }

    //Takes a number/string and adds commas
    commaSeparateNumber(val){
        while (/(\d+)(\d{3})/.test(val.toString())){
            val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
        }
        return val;
    }

    //Takes a number/string and adds commas
    formatPriceNumber(val){
      if ( val === null || val === undefined ) {
        return "";
      }
      else if ( val === 0 || val === "0" || val === "$0" ) {
        return "N/A";
      }
      else if ( /(#+)/.test(val.toString()) ) {
        return val;
      }
      else {
        return "$" + this.commaSeparateNumber(val);
      }
    }

    fullstate = function(state){
        var stateName = {
            AL: 'Alabama',
            AK: 'Alaska',
            AZ: 'Arizona',
            AR: 'Arkansas',
            CA: 'California',
            CO: 'Colorado',
            CT: 'Connecticut',
            DC: 'District of Columbia',
            DE: 'Delaware',
            FL: 'Florida',
            GA: 'Georgia',
            HI: 'Hawaii',
            ID: 'Idaho',
            IL: 'Illinois',
            IN: 'Indiana',
            IA: 'Iowa',
            KS: 'Kansas',
            KY: 'Kentucky',
            LA: 'Lousiana',
            ME: 'Maine',
            MD: 'Maryland',
            MA: 'Massachusetts',
            MI: 'Michigan',
            MN: 'Minnesota',
            MS: 'Mississippi',
            MO: 'Missouri',
            MT: 'Montana',
            NE: 'Nebraska',
            NV: 'Nevada',
            NH: 'New Hampshire',
            NJ: 'New Jersey',
            NM: 'New Mexico',
            NY: 'New York',
            NC: 'North Carolina',
            ND: 'North Dakota',
            OH: 'Ohio',
            OK: 'Oklahoma',
            ON: 'Ontario',
            OR: 'Oregon',
            PA: 'Pennsylvania',
            PR: 'Puerto Rico',
            RI: 'Rhode Island',
            SC: 'South Carolina',
            SD: 'South Dakota',
            TN: 'Tennessee',
            TX: 'Texas',
            UT: 'Utah',
            VT: 'Vermont',
            VA: 'Virginia',
            WA: 'Washington',
            WV: 'West Virginia',
            WI: 'Wisconsin',
            WY: 'Wyoming'
        };
        if ( state !== undefined && state !== null ) {
          state = state.toUpperCase();
        }
        return stateName[state];
    };

    // Converts State Postal to AP Abbreviation
    stateToAP = function(state) {
        var stateAP = {
            AL: 'Ala.',
            AK: 'Alaska',
            AZ: 'Ariz.',
            AR: 'Ark.',
            CA: 'Calif.',
            CO: 'Colo.',
            CT: 'Conn.',
            DE: 'Del.',
            DC: 'D.C.',
            FL: 'Fla.',
            GA: 'Ga.',
            HI: 'Hawaii',
            ID: 'Idaho',
            IL: 'Ill.',
            IN: 'Ind.',
            IA: 'Iowa',
            KS: 'Kan.',
            KY: 'Ky.',
            LA: 'La.',
            ME: 'Maine',
            MD: 'Md.',
            MA: 'Mass.',
            MI: 'Mich.',
            MN: 'Minn.',
            MS: 'Miss.',
            MO: 'Mo.',
            MT: 'Mont.',
            NE: 'Neb.',
            NV: 'Nev.',
            NH: 'N.H.',
            NJ: 'N.J.',
            NM: 'N.M.',
            NY: 'N.Y.',
            NC: 'N.C.',
            ND: 'N.D.',
            OH: 'Ohio',
            OK: 'Okla.',
            OR: 'Ore.',
            PA: 'Pa.',
            RI: 'R.I.',
            SC: 'S.C.',
            SD: 'S.D.',
            TN: 'Tenn.',
            TX: 'Texas',
            UT: 'Utah',
            VT: 'Vt.',
            VA: 'Va.',
            WA: 'Wash.',
            WV: 'W.Va.',
            WI: 'Wis.',
            WY: 'Wyo.',
            PR: 'P.R.'
        };
        if ( state !== undefined && state !== null ) {
          state = state.toUpperCase();
        }
        return stateAP[state];
    };

    //Transforms camel case to regular case (Words split up and capitalized)
    camelCaseToRegularCase = function(str){
        str = str
            .replace(/([A-Z][a-z]+)/g, " $1")
            .replace(/([A-Z][A-Z]+)/g, " $1")
            .replace(/([^A-Za-z ]+)/g, " $1")
            // uppercase the first character
            .replace(/^./, function(str){ return str.toUpperCase(); })
        return str;
    };

    //Transforms kabab-case to camelCase
    kababCaseToCamelCase = function(str){
        str = str.replace(/-/g, ' ');
        str = this.toTitleCase(str);
        str = str.replace(/ /g, '');
        str = str[0].toLowerCase() + str.slice(1);
        return str;
    };

    //Transforms camelCase to kabab-case
    camelCaseToKababCase = function(str){
        str = str
            .replace(/([A-Z][a-z]+)/g, " $1")
            .replace(/([A-Z][A-Z]+)/g, " $1")
            .replace(/([^A-Za-z ]+)/g, " $1")
            .replace(/ /g, '-');
        //Lowercase entire string
        str = str.toLowerCase();
        return str;
    };

    //Transforms any string to kab
    toLowerKebab = function(str){
        str = str.toLowerCase()
            .replace(/\s+/g, '-');
        return str;
    }

    convertListName = function(val){
        var names = {
            'homesAtLeast5YearsOld': 'Homes at least 5 years old',
            'homes-at-least-5-years-old': 'Homes at least 5 years old',
            'homesLessThan5YearsOld': 'Homes less than 5 years old',
            'homes-less-than-5-years-old': 'Homes less than 5 years old',
            'homesWithSprinklerAndDeck': 'Homes with sprinkler and deck',
            'homes-with-sprinkler-and-deck': 'Homes with sprinkler and deck',
            'homesWithVaultedCeilingsAndSecuritySystem': 'Homes with vaulted ceiling and security system',
            'homes-with-vaulted-ceilings-and-security-system': 'Homes with vaulted ceiling and security system',
            'homesLargest': 'Largest homes',
            'homes-largest': 'Largest homes',
            'homesBrickLeastExpensive': 'Least expensive brick houses',
            'homes-brick-least-expensive': 'Least expensive brick houses',
            'homesLeastExpensive': 'Least expensive homes',
            'homes-least-expensive': 'Least expensive homes',
            'homesWithPoolLeastExpensive': 'Least expensive homes with a swimming pool',
            'homes-with-pool-least-expensive': 'Least expensive homes with a swimming pool',
            'homesWithWaterfrontLeastExpensive': 'Least expensive homes with waterfront',
            'homes-with-waterfront-least-expensive': 'Least expensive homes with waterfront',
            'homesWith2BedroomsMostExpensive': 'Most expensive 2 bedroom homes',
            'homes-with-2-bedrooms-most-expensive': 'Most expensive 2 bedroom homes',
            'homesWith3BedroomsMostExpensive': 'Most expensive 3 bedroom homes',
            'homes-with-3-bedrooms-most-expensive': 'Most expensive 3 bedroom homes',
            'homesMostExpensive': 'Most expensive homes',
            'homes-most-expensive': 'Most expensive homes',
            'homesNewTraditional': 'New traditional homes',
            'homes-new-traditional': 'New traditional homes',
            'listingsInWealthiestZipCode': 'Listings in wealthiest ZIP code in area',
            'listings-in-wealthiest-zipcode': 'Listings in wealthiest ZIP code in area',
            'listingsWithLongDescriptions': 'Listings with long descriptions',
            'listings-with-long-descriptions': 'Listings with long descriptions',
            'listingsWithMoreThan10Photos': 'Listings with more than 10 photos',
            'listings-with-more-than-10-photos': 'Listings with more than 10 photos',
            'listingsWithMoreThan5Photos': 'Listings with more than 5 photos',
            'listings-with-more-than-5-photos': 'Listings with more than 5 photos',
            'listingsWithVirtualTours': 'Listings with virtual tours',
            'listings-with-virtual-tours': 'Listings with virtual tours',
            'listingsMostRecent': 'Most recent listings',
            'listings-most-recent': 'Most recent listings',
            'condosMostExpensive': 'Most expensive condos',
            'condos-most-expensive': 'Most expensive condos'
        };

        return typeof names[val] === 'undefined' ? this.camelCaseToRegularCase(val) : names[val];
    }

    randomList = function(){
      var lists = ["homesAtLeast5YearsOld",
        "homesLessThan5YearsOld",
        "homesWithSprinklerAndDeck",
        "homesWithVaultedCeilingsAndSecuritySystem",
        "homesLargest",
        "homesBrickLeastExpensive",
        "homesLeastExpensive",
        "homesWithPoolLeastExpensive",
        "homesWithWaterfrontLeastExpensive",
        "homesWith2BedroomsMostExpensive",
        "homesWith3BedroomsMostExpensive",
        "homesMostExpensive",
        "homesNewTraditional",
        "listingsWithLongDescriptions",
        "listingsWithMoreThan10Photos",
        "listingsWithMoreThan5Photos",
        "listingsWithVirtualTours",
        "listingsMostRecent",
        "condosMostExpensive"];
        return lists;
    }
    formatDaysOnMarket = function(daysOnMarket) {
        if ( daysOnMarket === null || daysOnMarket === undefined || daysOnMarket === "N/A" ) {
          return "N/A";
        }
        else {
          return moment().subtract(daysOnMarket, 'days').format('dddd MMM Do, YYYY');
        }
    }

    // Create a valid value to set to routerLink by parsing a string delimited by a | pipe
    // -- creating an object for params when the object syntax is present in string
    // example input string: "Location-page|{‘loc’:'Industry-CA’}"
    parseToRoute = function(stringRoute) {
        let stringRouteArr = stringRoute.split("|");

        let generatedUrl = stringRouteArr.map(function (item) {
            try {
                return JSON.parse(item);
            } catch (e) {
            }
            return item;
        });
        return generatedUrl;
    }

}
