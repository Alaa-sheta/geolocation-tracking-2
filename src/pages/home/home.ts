import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import * as firebase from 'Firebase';
import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';



declare var google: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('map2') mapElement2: ElementRef;
  map: any;
  map2: any;
  markers = [];
  markers2 = [];
  ref = firebase.database().ref('geolocations/');
  // ref2 = firebase.database().ref('geolocations/LxLqBfYPxytm1BKWsCr');
  marker;
  marker2;

  new_la = 0;
  new_lo = 0;

  Destination: any = 'madurai';
  MyLocation: any;


  constructor(public navCtrl: NavController,
    public platform: Platform,
    private geolocation: Geolocation,
    private device: Device) {
    platform.ready().then(() => {
      this.initMap();
    });
    this.ref.on('value', resp => {
      this.deleteMarkers();
      snapshotToArray(resp).forEach(data => {
        if(data.uuid !== this.device.uuid) {
          let image = 'assets/imgs/green-bike.png';
          let updatelocation = new google.maps.LatLng(data.latitude,data.longitude);
          this.addMarker(updatelocation,image);
          this.setMapOnAll(this.map);
        } else {
          let image = 'assets/imgs/blue-bike.png';
          let updatelocation = new google.maps.LatLng(data.latitude,data.longitude);
          this.addMarker(updatelocation,image);
          this.setMapOnAll(this.map);
        }
      });
    });
    
    // this.ref2.on('value', resp => {(resp)

    //   // snapshotToArray(resp).forEach(data => {
    //   //     let image = 'assets/imgs/placeholder.png';
    //   //     let updatelocation2 = new google.maps.LatLng(data.latitude,data.longitude);
    //   //     this.addMarker(updatelocation2,image);
    //   //     this.setMapOnAll(this.map2);
    //   // });
    // });

    this.ref.on('value', (snapshot)=> {
      console.log(snapshot.child("-LxW8zGOkZLhr9iIcYd7").val());
      this.new_la = snapshot.child("-LxW8zGOkZLhr9iIcYd7/latitude").val();
      this.new_lo = snapshot.child("-LxW8zGOkZLhr9iIcYd7/longitude").val();
      let image = 'assets/imgs/placeholder.png';
      let updatelocation2 = new google.maps.LatLng(this.new_la,this.new_lo);
      this.addMarker2(updatelocation2,image);
      this.setMapOnAll2(this.map2);
      // this.calculateAndDisplayRoute();
    }, function(error) {
      console.error(error);
    });    
  }

  initMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
      let mylocation = new google.maps.LatLng(resp.coords.latitude,resp.coords.longitude);
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        zoom: 15,
        center: mylocation
      });
      this.map2 = new google.maps.Map(this.mapElement2.nativeElement, {
        zoom: 15,
        center: mylocation
      });
    });
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.deleteMarkers();
      this.updateGeolocation( data.coords.latitude,data.coords.longitude);
      let updatelocation = new google.maps.LatLng(data.coords.latitude,data.coords.longitude);
      let image = 'assets/imgs/blue-bike.png';
      this.addMarker(updatelocation,image);
      this.setMapOnAll(this.map);
    });
  }

  addMarker(location, image) {
     this.marker = new google.maps.Marker({
      position: location,
      map: this.map,
      draggable: true,
      icon: image
    });
    google.maps.event.addListener(this.marker, 'dragend', function() {
     
        console.log(this.position.lat() + " : "+ this.position.lng());
        // this.updateGeolocation(this.position.lat(),this.position.lng());

        if(localStorage.getItem('mykey')) {
          firebase.database().ref('geolocations/'+localStorage.getItem('mykey')).set({
           // uuid: uuid,
            latitude: this.position.lat(),
            longitude : this.position.lng()
          });
        } else {
          let newData = this.ref.push();
          newData.set({
          //  uuid: uuid,
            latitude: this.position.lat(),
            longitude: this.position.lng()
          });
          localStorage.setItem('mykey', newData.key);
        }      
    });
    
    // this.marker.addListener('dragend', (position)=>{
    //   console.log('dragend' + position)
    // });
    this.markers.push(this.marker);


    // this.ref.on('value',function (snapshot) {
    //   console.log(snapshot.child("-LxLqBfYPxytm1BKWsCr/latitude").val());
    //       let image = 'assets/imgs/placeholder.png';
    //       let updatelocation2 = new google.maps.LatLng(snapshot.child("-LxLqBfYPxytm1BKWsCr/latitude").val(),snapshot.child("-LxLqBfYPxytm1BKWsCr/longitude").val());
    //       this.addMarker(updatelocation2,image);
    //       this.setMapOnAll(this.map2);
    // }, function(error) {
    //   console.error(error);
    // });
  }

  addMarker2(location, image) {
    this.marker2 = new google.maps.Marker({
     position: location,
     map: this.map2,
     draggable: true,
     icon: image
   });
   this.markers2.push(this.marker2);
 }


  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }

  setMapOnAll2(map) {
    for (var i = 0; i < this.markers2.length; i++) {
      this.markers2[i].setMap(map);
    }
  }

  clearMarkers() {
    this.setMapOnAll(null);
  }

  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }

  updateGeolocation(lat, lng) {
    if(localStorage.getItem('mykey')) {
      firebase.database().ref('geolocations/'+localStorage.getItem('mykey')).set({
       // uuid: uuid,
        latitude: lat,
        longitude : lng
      });
    } else {
      let newData = this.ref.push();
      newData.set({
      //  uuid: uuid,
        latitude: lat,
        longitude: lng
      });
      localStorage.setItem('mykey', newData.key);
    }
  }

//   calculateAndDisplayRoute() {
//     let that = this;
//     let directionsService = new google.maps.DirectionsService;
//     let directionsDisplay = new google.maps.DirectionsRenderer;
//     const map = new google.maps.Map(document.getElementById('map'), {
//       zoom: 7,
//       center: {lat: 31.2057856, lng: 29.913088}
//     });
//     directionsDisplay.setMap(map);

//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(function(position) {
//         var pos = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude
//         };
//         // console.log("Laaaaat"+that.new_la)
//         map.setCenter(pos);
//         that.MyLocation = new google.maps.LatLng(pos);

//       }, function() {

//       });
//     } else {
//       // Browser doesn't support Geolocation
//     }

//     directionsService.route({
//     origin: this.MyLocation,
//     destination: this.Destination,
//     travelMode: 'DRIVING'
//   }, function(response, status) {
//     if (status === 'OK') {
//       directionsDisplay.setDirections(response);
//     } else {
//       window.alert('Directions request failed due to ' + status);
//     }
//   });
// }
pos;
calculateAndDisplayRoute() {
  let directionsService = new google.maps.DirectionsService();
  let directionsRenderer = new google.maps.DirectionsRenderer();
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: {lat: 31.2057856, lng: 29.913088}
  });
  directionsRenderer.setMap(map);
        // var map = new google.maps.Map(document.getElementById('map'), {
        //   zoom: 7,
        //   center: {lat: 41.85, lng: -87.65}
        // });
  // this.geolocation.getCurrentPosition().then((resp) => {
  //   this.pos = {
  //     lat: resp.coords.latitude,
  //     lng: resp.coords.longitude
  //   };});
  //   var pos2 ={
  //     lat: this.new_la,
  //     lng: this.new_lo
  //   };
  directionsService.route(
      {
        // hwa hna el mafrod n7ot el current location ana kont a7ot 3ly pos 2ly m3mloha comment dlw2ty
        origin: 'Chicago, IL',
        // w hna el location 2ly byt2ra min firebase 2ly hwa pos2 bs ana bagrbhm fixed w bardo mnf3sh
        destination:'Los Angeles, CA',
        travelMode: 'DRIVING'
      },
      function(response, status) {
        if (status === 'OK') {
          console.log("hereee")
          directionsRenderer.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
}
}


export const snapshotToArray = snapshot => {
    let returnArr = [];

    snapshot.forEach(childSnapshot => {
        let item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
    });

    return returnArr;
};
