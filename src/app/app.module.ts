import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Camera } from '@ionic-native/camera/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { Network } from '@ionic-native/network/ngx';

import { Geolocation } from '@ionic-native/geolocation/ngx';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore';
import { Firebase } from '@ionic-native/firebase/ngx';

const config = {
    apiKey: "AIzaSyA3K4fgiOrNzlLoMeBgmbO08SZjckdZU7Y",
    authDomain: "pokedex-fb744.firebaseapp.com",
    databaseURL: "https://pokedex-fb744.firebaseio.com",
    projectId: "pokedex-fb744",
    storageBucket: "pokedex-fb744.appspot.com",
    messagingSenderId: "1038342273674",
    appId: "1:1038342273674:web:8d349d46773e6091860b73"
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(), AppRoutingModule, AngularFireModule.initializeApp(config),
    AngularFireModule],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Camera,
    Network,
    Firebase,
    AngularFirestore,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
