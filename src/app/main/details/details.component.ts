import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Pokemon } from '../../pokemon.class';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  @Input() currentPokemonData: Pokemon = new Pokemon;
  @Input() fullPokemonList: Array<any> = [];
  evoImage1: string = "";
  evoImage2: string = "";
  evoImage3: string = "";

  menuNumber: number = 1;

  constructor() {
  }

  loadAbout() {
    this.menuNumber = 1;
  }

  loadStats() {
    this.menuNumber = 2;
  }

  loadEvo() {
    this.menuNumber = 3;
    if (this.currentPokemonData['evolution'][0]['name']) this.loadPokemonSpriteForEvolution(this.currentPokemonData['evolution'][0]['name'], 0);
    if (this.currentPokemonData['evolution'][1]['name']) this.loadPokemonSpriteForEvolution(this.currentPokemonData['evolution'][1]['name'], 1);
    if (this.currentPokemonData['evolution'][2]['name']) this.loadPokemonSpriteForEvolution(this.currentPokemonData['evolution'][2]['name'], 2);
  }

  loadMoves() {
    this.menuNumber = 4;
  }

  removeDetailsOverlay() {
    this.menuNumber = 1;
    document.getElementById('details')?.classList.add('dp-none');
  }

  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  currentPokemonIsNotDisplayedInEvolutions(pokemonEvolution: any) {
    if (pokemonEvolution['name'] != this.currentPokemonData['name']) {
      return true;
    } else {
      return false;
    }
  }

  loadPokemonSpriteForEvolution(pokename: string, id: number) {
    this.fullPokemonList.find((pokemon) => {
      if (pokemon.name === pokename) {
        switch (id) {
          case 0:
            this.evoImage1 = pokemon.sprites;
            break;
          case 1:
            this.evoImage2 = pokemon.sprites;
            break;
          case 2:
            this.evoImage3 = pokemon.sprites;
            break;
        }
      }
      return;
    });
  }

  setNewCurrentPokemon(pokemonName: string) {
    this.fullPokemonList.filter(singlePokemon => {
      if (singlePokemon.name == pokemonName) {
        this.currentPokemonData = singlePokemon;
      }
    });
  }
}
