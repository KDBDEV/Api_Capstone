let map, infoWindow;
let allow = false;
let pos = {
  lat: 39.290,
  lng: 76,612
};

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
       pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent("You are here.");
      infoWindow.open(map);
      map.setCenter(pos);
    }, function(){
      handleLocationError(true, infoWindow, map.getCenter());

    });
  } else {
    handleLocationError(false, infoWindow, map.getCenter();)
  }
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
'Error: The Geolocation service failed.' :
'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
}