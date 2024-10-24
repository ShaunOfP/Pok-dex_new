import { Component, OnInit } from '@angular/core';
import { PokeapiService } from '../pokeapi.service';
import { HttpClientModule } from '@angular/common/http';
import { CardComponent } from './components/card/card.component';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from "./details/details.component";
import { Pokemon } from '../pokemon.class';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HttpClientModule, CardComponent, CommonModule, DetailsComponent],
  providers: [PokeapiService],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})

export class MainComponent implements OnInit {
  requests: Observable<any>[] = [];
  evoRequests: Observable<any>[] = [];
  colorList: Array<any> = [];
  fullPokemonInfoList: Array<any> = [];
  evolutionList: Array<any> = [];
  currentPokemonData: Pokemon = new Pokemon();

  constructor(private pokeapiService: PokeapiService) {
  }


  /**
   * Calls functions to load the Pokemon Data from the API
   */
  ngOnInit() {
    this.pushPokemonColorsIntoArray();
    this.pushEvolutionListIntoArray();
    this.fillPokemonInfoList();
  }


  /**
   * 
   */
  fillPokemonInfoList() {
    for (let i = 1; i <= 1025; i++) {
      this.requests.push(this.pokeapiService.getPokemonInfoList(i));
    }

    forkJoin(this.requests).subscribe({
      next: (responses) => {
        this.restructurePokeData(responses);
      },
      error: (err) => {
        console.error('Failed to fetch some Pokémon data', err);
      }
    });
  }


  /**
   * 
   * @param data 
   */
  restructurePokeData(data: Array<any>) {
    data.forEach(pokemonData => {
      this.fullPokemonInfoList.push({
        abilities: this.searchDataSubArrayForValues(pokemonData.abilities, 'ability', 'name'),
        base_experience: pokemonData.base_experience,
        game_indices: this.searchDataSubArrayForValues(pokemonData.game_indices, 'version', 'name'),
        forms: this.searchDataSubArrayForValues(pokemonData.forms, '', 'name'),
        id: pokemonData.id,
        formattedId: this.formatNumber(pokemonData.id),
        moves: this.searchDataSubArrayForValues(pokemonData.moves, 'move', 'name'),
        name: this.capitalizeFirstLetter(pokemonData.name),
        species: pokemonData.species,
        sprites: pokemonData['sprites']['other']['official-artwork']['front_default'],
        stats: pokemonData.stats,
        types: this.searchDataSubArrayForValues(pokemonData.types, 'type', 'name'),
        weight: pokemonData.weight,
        evolution: this.sortEvolutionToPokemonData(this.capitalizeFirstLetter(pokemonData.name)),
        color: this.getPokemonColor(this.capitalizeFirstLetter(pokemonData.name))
      });
    });
  }


  /**
   * 
   */
  pushEvolutionListIntoArray() {
    for (let i = 1; i <= 549; i++) {
      if (i == 210 || i == 222 || i == 225 || i == 226 || i == 227 || i == 231 || i == 238 || i == 251) {
        continue;
      } else {
        this.evoRequests.push(this.pokeapiService.getEvolutionInfoList(i));
      }
    }

    forkJoin(this.evoRequests).subscribe({
      next: (responses) => {
        this.restructureEvolutionData(responses);
      },
      error: (err) => {
        console.error('Failed to fetch some Pokémon data', err);
      }
    });
  }


  restructureEvolutionData(data: Array<any>) {
    data.forEach(evolutionData => {
      if (evolutionData.chain['evolves_to'] == 0) {
        data = ["This Pokemon does not evolve"];
      } else if (evolutionData.chain['evolves_to'][0]['evolves_to'] == 0) {
        data = [this.capitalizeFirstLetter(evolutionData.chain['species']['name']), this.capitalizeFirstLetter(evolutionData.chain['evolves_to'][0]['species']['name']), ""];
      } else {
        data = [this.capitalizeFirstLetter(evolutionData.chain['species']['name']), this.capitalizeFirstLetter(evolutionData.chain['evolves_to'][0]['species']['name']), this.capitalizeFirstLetter(evolutionData.chain['evolves_to'][0]['evolves_to'][0]['species']['name'])];
      }
      this.evolutionList.push(data);
    });
  }


  /**
   * Subscribes to a function(Observable) which get the color data from the PokeAPI and pushes it into an array
   */
  pushPokemonColorsIntoArray() {
    for (let i = 0; i < 10; i++) {
      this.pokeapiService.getColorsOfPokemon().subscribe({
        next: (data) => {
          data = {
            name: data.name,
            pokemon_species: this.searchDataSubArrayForValues(data.pokemon_species, "", "name")
          }
          this.colorList.push(data);
        },
        error: (error) => {
          console.error('There was an error retrieving the Pokemon Color Data from the API!', error);
        }
      });
    }
  }


  /**
   * This capitalizes the first letter of the provided string
   * @param string a single Word/String
   * @returns the same string with its first letter capitalized
   */
  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


  /**
   * This takes a number as parameter, converts it to a string and returns the formatted string. Won't change anything
   * if the number is bigger than 99
   * @param value a number
   * @returns the number as a string with two zeros (e.g. 1 => 001; 23 => 023; 120 => 120)
   */
  formatNumber(value: number): string {
    return value.toString().padStart(3, '0');
  }


  /**
   * This is used to look into the provided array via the searchValues and modify the data which is at that location
   * @param array array of string
   * @param searchValue1 a string which is used to search inside of the array
   * @param searchValue2 another string which is used to search inside of the array
   * @returns a string with its first letter capitalized
   */
  searchDataSubArrayForValues(array: string[], searchValue1: string, searchValue2: string) {
    return array.map((item: any) => {
      if (searchValue1 == '' || searchValue1 == null) {
        return item[searchValue2] = this.capitalizeFirstLetter(item[searchValue2]);
      } else {
        return item[searchValue1][searchValue2] = this.capitalizeFirstLetter(item[searchValue1][searchValue2]);
      }
    });
  }


  /**
   * This is used to assign the data of the clicked Pokemon Card to the currentPokemonData variable and 
   * show the Details section for this Pokemon afterwards
   * @param pokemonData a set of data of the selected current Pokemon
   */
  setCurrentPokemonData(pokemonData: Pokemon) {
    this.currentPokemonData = pokemonData;
    document.getElementById('details')?.classList.remove('dp-none');
  }


  /**
   * Searches the evolution list for the provided pokemon name and returns the evolution array of this pokemon
   * @param pokemonName Name of a Pokemon
   */
  sortEvolutionToPokemonData(pokemonName: string) {
    return this.evolutionList.filter(evo => evo.includes(pokemonName));
  }


  /**
   * This searches for the pokemon name inside of the colorList array and returns the matching color for the 
   * provided pokemon name
   * @param pokemonName string containing the name of a pokemon
   * @returns a string (red, green, etc.)
   */
  getPokemonColor(pokemonName: string) {
    for (let i = 0; i < this.colorList.length; i++) {
      if (this.colorList[i]['pokemon_species'].includes(pokemonName)) {
        return this.colorList[i]['name'];
      }
    }

    this.givePokemonColor();
  }

  givePokemonColor() {
    this.fullPokemonInfoList.map(pokemon => {
      if (pokemon.color == undefined || pokemon.color == "") {
        pokemon.color = 'default';
      }
    });
  }
}