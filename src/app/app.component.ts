import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import * as firebase from 'Firebase';
import { HomePage } from '../pages/home/home';


const config = {
  apiKey: "AIzaSyBW5-fbQUHSNNd3RvyZGYETeASIq2CPzlA",
  authDomain: "geotracker-3b4d1.firebaseapp.com",
  databaseURL: "https://geotracker-3b4d1.firebaseio.com",
  projectId: "geotracker-3b4d1",
  storageBucket: "geotracker-3b4d1.appspot.com",
};
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    firebase.initializeApp(config);
  }
}

