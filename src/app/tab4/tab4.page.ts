import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../Services/PokemonService';
import { Pokemon } from '../model/Pokemon';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  pokemon: Pokemon[] = [];

  constructor(private pokemonService: PokemonService) { }

  ngOnInit() {
    this.getCaughtPokemon();
  }

  getCaughtPokemon(): void {
    this.pokemon = this.pokemonService.caughtPokemon;
  }

}
