import { Component, OnInit, Input } from '@angular/core';
import { PokemonService } from '../Services/PokemonService';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Pokemon } from '../model/Pokemon';

@Component({
  selector: 'app-catch',
  templateUrl: './catch.page.html',
  styleUrls: ['./catch.page.scss'],
})
export class CatchPage implements OnInit {
  @Input() pokemon: Pokemon;
  chance = 33;
  catchMessage: string;
  caught: boolean;

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit() {
    this.getPokemon();
  }

  goBack(): void {
    this.location.back();
  }

  getPokemon() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.pokemonService.fetchPokemonData(id).then(() => {
      this.pokemon = this.pokemonService.getPokemonFromId(id);
    });
  }

  catch() {
    if (!this.caught) {
      const rand = Math.round(Math.random() * (100));
      if (rand < this.chance) {
        this.caught = true;
        this.catchMessage = 'Gotcha!';
        setTimeout(() => {
          this.pokemonService.caughtPokemon.push(this.pokemon);
          this.router.navigateByUrl('/tabs/tab4');
          }, 1000);
      } else {
        this.catchMessage = 'The pokemon was not caught';
      }
    }
  }

}
