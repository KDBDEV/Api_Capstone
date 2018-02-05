const GOOGLE_URL = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAu7OSFPSks5queymfz10wpVsEr4qsd0RY&callback=initMap"
let map;
let service;
let infowindow;
let geocoder;
function initialize() {
  geocoder = new google.maps.Geocoder();
  let latlng = new google.maps.LatLng(40.6700, -73.9400);
  let mapOptions = {
    zoom: 8,
    center: latlng
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

function getLocation(location){
  geocoder.geocode( {
    "address": address
  },
  function(results,status){
    if (status == google.maps.GeocoderStatus.OK){
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        position: results.geometry.location
      });
    } else {
    }
  });
}

google.maps.event.addDOMListner(window,"load",initialize);
function getDataFromApi (cityInput,callback){
  const request = {

  }
}
$.getJSON(GOOGLE_URL,request,callback);

$(document).ready(function() {
    $("#map-address-btn").click(function(event){
      event.preventDefault();     
      var address = $("#location-address").val();         
      codeAddress(address);                  
    });
  });
/* function renderResults(result){

}
*/

function watchSubmit() {
  $("search").submit(event => {
    event.preventDefault();
    const address = $("#search-city").val();
    codeAddress(address);
  });
}

$(watchSubmit);

