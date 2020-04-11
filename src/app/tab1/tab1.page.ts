import { Component } from '@angular/core';
import { Pokemon } from '../model/Pokemon';
import { NavController, Platform} from '@ionic/angular';
import { PokemonService } from '../Services/PokemonService';
import { Network } from '@ionic-native/network/ngx';
import { ToastController } from '@ionic/angular';
import { ErrorService } from '../Services/ErrorService';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  allPokemon: Array<Pokemon> = [];
  lastPokemonId: number = 31;
  disconnectSubscription: any;

  constructor(public navCtrl: NavController, private service: PokemonService,private errorService: ErrorService,private network: Network, public toastController: ToastController,private platform: Platform ) {
  }
  
  ngOnInit(){
    this.platform.ready().then(() => {
       this.disconnectSubscription = this.network.onDisconnect().subscribe( async () => {
        this.errorService.showError("Your connection is gone")
      });
    })
    if(this.network.type != this.network.Connection.NONE){
    this.getPokemonData(1);
    }
    else{
      this.errorService.showError("You don't have internet");
    }
  }

  
  

   async getPokemonData(startNumber: number) {
    for(let i =startNumber; i<startNumber+30; i++){
      await this.service.fetchPokemonData(i).then(() =>{
        let pokemon = this.service.getPokemon(i);
        if(pokemon == null){
          this.errorService.showError("Getting the pokemon went wrong");
        }
        else{
          this.allPokemon.push(pokemon)
        }
      });
    }
  }


    async loadMorePokemon(ev: any){
      if(this.lastPokemonId >= 650){
        let scroll = <HTMLIonInfiniteScrollElement> document.getElementById("scroll");
        scroll.disabled = true;
        ev.target.complete();
      }
      else{
      await this.getPokemonData(this.lastPokemonId);
      this.lastPokemonId = this.lastPokemonId+ 30;
      ev.target.complete();
      }
    }

    goToDetails(id:any){
      if(this.allPokemon.find(p => p.id == id)){
        this.navCtrl.navigateRoot("detail/"+id);
      }
      else{
        this.errorService.showError("The page you are looking for does not exist.")
      }
    }

    doReorder(ev: any) {
      ev.detail.complete();
    }

    doRefresh(ev :any){
      if(this.allPokemon.find.length > 0){
      this.allPokemon.sort(function(a, b) {
        return a.id - b.id;
      });
    }
      ev.target.complete();
    } 
  
}
