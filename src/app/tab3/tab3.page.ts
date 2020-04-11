import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Position } from '../model/Position';
import { Platform} from '@ionic/angular';
import { PokemonService } from '../Services/PokemonService';
import { Pokemon } from '../model/Pokemon';
import { Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { ErrorService } from '../Services/ErrorService';

declare var google: any;

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  lat: any;
  long: any;
  meta = '';
  map: any;
  disconnectSubscription: any;

  nearbyPokemon: Pokemon[] = [];


  constructor(private geolocation: Geolocation, private service: PokemonService, private errorService: ErrorService, private router: Router,private network: Network,private platform: Platform ) {
  }

  ngOnInit(){
    this.platform.ready().then(() => {
       this.disconnectSubscription = this.network.onDisconnect().subscribe( async () => {
        this.errorService.showError("Your connection is gone")
      });
    })
    if(this.network.type !== this.network.Connection.NONE){
      this.getLocation();
      this.startLocating();
    }
    else{
      this.errorService.showError("You don't have internet");
    }
  }

  makeMap(latitude: number, longtitude: number, pokemon: Pokemon[]) {
    const location = {lat: latitude, lng: longtitude};
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: location,
      zoom: 14
    });

    const marker = new google.maps.Marker({position: location, label: 'You', map: this.map});

    pokemon.forEach(pok => {
      const googlePos = {lat: pok.location.latitude, lng: pok.location.longtitude};

      const content = '<div><h1>`pok.name`</h1></div>';

      const markerPokemon = new google.maps.Marker({position: googlePos, map: this.map});

      const contentString = '<div><h3 style="color: black;">' + pok.name.charAt(0).toUpperCase() + pok.name.slice(1) + '</h3></div>';

      const infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      markerPokemon.addListener('click', function() {
        infowindow.open(this.map, markerPokemon);
      });
    });
  }

  getLocation(): void {
    this.geolocation.getCurrentPosition({
      enableHighAccuracy: true
    }).then((res) => {
      this.lat = res.coords.latitude;
      this.long = res.coords.longitude;
      this.generatePokemonPositions();
    }).catch((e) => {
      console.log(e);
    });
  }

  startLocating(): void {
    this.geolocation.watchPosition()
    .subscribe(position => {
    this.lat = position.coords.latitude;
    this.long = position.coords.longitude;
  });
  }

  generatePokemonPositions(): void {
    for (let i = 0; i < 5; i++) {
      const loc = new Position(
        this.lat + (Math.random() * (0.010000 - 0.000001) + 0.000001),
        this.long + (Math.random() * (0.010000 - 0.000001) + 0.000001)
        );

      const rand = Math.round(Math.random() * (600 - 1)) + 1;

      this.service.fetchPokemonData(rand).then(() => {
        const pokemon = this.service.getPokemonFromId(rand);
        pokemon.location = loc;
        this.nearbyPokemon.push(pokemon);
        this.makeMap(this.lat, this.long, this.nearbyPokemon);
      });
    }

  }

  catchPokemon(id: number): void {
    console.log(id);
  }

  startCatch(id: number): void {
    const pokIndex = this.nearbyPokemon.indexOf(this.nearbyPokemon.find(pok => pok.id === id));
    this.nearbyPokemon.splice(pokIndex, 1);
    this.makeMap(this.lat, this.long, this.nearbyPokemon);
    this.router.navigateByUrl('/catch/' + id);
  }

}
