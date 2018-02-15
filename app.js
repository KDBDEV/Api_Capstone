"use strict";

let placeSearch, autocomplete;
const componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
};

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */(document.getElementById('query')),
        { types: ['geocode'] });
    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();
    for (var component in componentForm) {
        document.getElementById(component).value = '';
        document.getElementById(component).disabled = false;
    }
    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            document.getElementById(addressType).value = val;
        }
    }
}

// Declare Constants
const appState = {
  apiKey: AIzaSyAhzMPUFxKG3VTooZrZ0ZKU_9zy3cCWJJE
  geoLoaction: [],
  resultMarkers: [],
  searchResults: [],
  userInput: null
};

const requestSearchResults = (state, input, callback) => {
  const baseURL = "https://maps.googleapis.com/maps/api";
  const geocodeURL = `${baseURL}/geocode/json?address=${input}&key=${state.apiKey}`;
  //geocode API request
  $.getJSON(geocodeURL, data => {
    //adds geocode to state
    const location = data.results[0].geometry.location;
    //creates new location object using place libary and assign it to a variable
    const focus = new google.maps.LatLng(location.lat, location.lng);
    //pushes lat/long into state
    state.geoLocation = [location.lat, location.lng];
    //required for PlacesService function

    // sets where to make Google Places request
    const googlePlaces = new google.maps.places.PlacesService(map);
    const request = {
      location: focus,
      radius: '5000',
      types: ['cafe']
    };
    //Google Places API request
    googlePlaces.nearbySearch(request, (results, status) => {
      appState.searchResults = results;
      console.log('place results', results);
      callback(appState);
      addPlaceMarkers(appState);
    });
    $('.map-container').removeClass('hidden');
  });
};

// STATE MODS
function setUserInput(state, userInput) {
  state.userInput = userInput;
}

// EVENTS
function submitData(event) {
  event.preventDefault();
  $('.loading').removeClass('hidden');
  const userInput = $(event.currentTarget).find('input').val();
  setUserInput(appState, userInput);
  requestSearchResults(appState, userInput, renderHtml);

}

function eventHandling() {
  $('.search-bar').submit(function (event) {
    submitData(event);
  });

  $('#query').keydown(function (event) {
    if (event.keyCode === 13) {
      $('.search-bar').submit();
    }
  });

  //Check to see if the window is top if not then display button
  $(window).scroll(function(){
    if ($(this).scrollTop() > 100) {
      $('.scrollToTop').fadeIn();
    } else {
      $('.scrollToTop').fadeOut();
    }
  });
}

// DOCUMENT READY FUNCTIONS
$(function () {
  eventHandling();
});


/*
//declares map var
var map, infoWindow;
var pos = {
  lat: 39.2904,
  lng: -76.6122
};
// initializes the first map to be rendered to the user
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: pos,         
    zoom: 15,
});

var input = document.getElementById("searchBox");
var searchBox = new google.maps.places.SearchBox(input);
infoWindow = new google.maps.InfoWindow;

var request = {
  location: pos,
  radius: "500",
  query: "cafe"
};

map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
    // Preform a request with nearby, hard coded keyword cafe
    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);
  });
// callback for query
function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
  }
}
// stores the location markers we add
var markers = [];

// below is the listener for the searchBox
searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
    console.log(places[0]);
    var placeDiv = document.getElementById('placeInfo');
    placeDiv.innerHTML = places[0]['formatted_address'] + "<br>";
    
    var photos = places[0]['photos'];
    
    console.log(typeof photos);
    
    try{
        for(var i = 0; i < photos.length; i++){
            var photoUrl = photos[i].getUrl({'maxWidth': 200, 'maxHeight': 200});
            var imgStr = "<img src='"+ photoUrl +"' alt='image'>";
            placeDiv.innerHTML += imgStr;
        }
        var reviews = places[0]['reviews'];
        console.log(reviews);
        placeDiv.innerHTML += "<br><ol class='smallerText'>";
        for(var index in reviews){

            placeDiv.innerHTML += "<li>" + reviews[index]["text"] + "</li>";
            
        }
        placeDiv.innerHTML += "</ol>";
    }catch(err){
        placeDiv.innerHTML += "Sorry No Images!";
    }
    if (places.length == 0) {
      return;
    }
    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];
    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
    
});
    
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
//geolocation logic
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
     var pos = {
        lat: position.coords.latitude,
         lng: position.coords.longitude
      };

   infoWindow.setPosition(pos);
    infoWindow.setContent('Location found.');
    infoWindow.open(map);
    map.setCenter(pos);
     }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
 } else {
   // Browser doesn't support Geolocation
     handleLocationError(false, infoWindow, map.getCenter());
  }

}
// displays to user geolocation has failed
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
  'Error: The Geolocation service failed.' :
  'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}
*/