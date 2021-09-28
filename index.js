// // Initialize and add the map
// function initMap2() {
//   // The location of Uluru
//   const uluru = { lat: -25.344, lng: 200.036 };
//   // The map, centered at Uluru
//   const map = new google.maps.Map(document.getElementById("map"), {
//     zoom: 4,
//     center: uluru,
//   });
//   // The marker, positioned at Uluru
//   const marker = new google.maps.Marker({
//     position: uluru,
//     map: map,
//   });
// }


function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 15,
  });
  const marker = new google.maps.Marker();
  marker.setMap(map);

  infoWindow = new google.maps.InfoWindow();

  // firebaseの初期化
  const firebaseConfig = {
    apiKey: "AIzaSyB81w2rVg3MJMXsPLdRFg9U7Fhqwrmr_zw",
    authDomain: "shohei-firebase-dev.firebaseapp.com",
    databaseURL: "https://shohei-firebase-dev-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "shohei-firebase-dev",
    storageBucket: "shohei-firebase-dev.appspot.com",
    messagingSenderId: "499736915204",
    appId: "1:499736915204:web:3adcedbb8500958141b451",
    measurementId: "G-HB4C7MYQLG"
  };
  firebase.initializeApp(firebaseConfig);

  const sessionId = Math.floor(Math.random() * 10000000000).toString();


  watchPositionAndUpdateMarker(map, marker, sessionId);
}

function watchPositionAndUpdateMarker(map, marker, sessionId) {
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        map.setCenter(pos);

        // The marker, positioned at center
        marker.setPosition(pos);

        console.log("marker set at:", pos);

        // firebaseに入れる
        firebase.database().ref('positions/' + sessionId).set({
          lat: pos.lat,
          lng: pos.lng
        });

      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}
