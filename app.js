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