import { Component } from '@angular/core';
import { Pokemon } from '../model/Pokemon';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../Services/PokemonService';
import { NavController } from '@ionic/angular';
import { ErrorService } from '../Services/ErrorService';

@Component({
    templateUrl: 'pokemonDetail.page.html',
    styleUrls: ['pokemonDetail.page.scss']
  })
  export class PokemonDetailPage {

    pokemon: Pokemon;
    private id: string;

    constructor(private route: ActivatedRoute, private service: PokemonService, public navCtrl: NavController, private errorService: ErrorService){
    }

    ngOnInit(){
        this.id = this.route.snapshot.paramMap.get('id');
        this.service.fetchPokemonData(parseInt(this.id)).then(() => {
            this.pokemon = this.service.getPokemonFromId(parseInt(this.id));
            if(!this.pokemon){
            this.errorService.showError("Something went wrong please go back");
            }
        })

    }

    goBack(){
           this.navCtrl.navigateBack("tabs/tab1") 
    }

  }