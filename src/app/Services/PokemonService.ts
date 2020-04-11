import { Pokemon } from '../model/Pokemon';
import { Injectable } from '@angular/core';
import { ErrorService } from './ErrorService';
@Injectable({ providedIn: 'root'})

export class PokemonService {

    allPokemon: Pokemon[] = [];
    caughtPokemon: Pokemon[] = [];


    constructor(private errorService: ErrorService) {
    }

      async fetchPokemonData(pokedexid: number) {
        await fetch('https://pokeapi.co/api/v2/pokemon/' + pokedexid)
        .then(response => response.json())
        .then((pokeData) => {
          let newpokemon = new Pokemon(pokeData.name, pokeData.id, pokeData.types, pokeData.moves,pokeData.sprites.front_default,pokeData.sprites.front_shiny, pokeData.sprites.back_default, pokeData.sprites.back_shiny)   
          this.allPokemon.push(newpokemon);
        }).catch((function(error){
          
        }))
      }

      getPokemon(pokedexid: number): Pokemon {
        return this.allPokemon[pokedexid - 1 ];
      }

      getPokemonFromId(n: number): Pokemon {
        return this.allPokemon.find(pok => pok.id === n);
      }

}
