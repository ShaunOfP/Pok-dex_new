import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PokeapiService } from '../pokeapi.service';
import { HttpClientModule } from '@angular/common/http';
import { CardComponent } from './components/card/card.component';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from "./details/details.component";
import { Pokemon } from '../pokemon.class';
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { mergeMap, toArray } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HttpClientModule, CardComponent, CommonModule, DetailsComponent, FormsModule],
  providers: [PokeapiService],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})

export class MainComponent implements OnInit, AfterViewInit {
  requests: Observable<any>[] = [];
  evoRequests: Observable<any>[] = [];
  colorList: Array<any> = [];
  fullPokemonInfoList: Array<any> = [];
  filteredPokemonList: Array<any> = [];
  searchTerm: string = '';
  evolutionList: Array<any> = [];
  currentPokemonData: Pokemon = new Pokemon();
  showLoader: Boolean = true;

  constructor(private pokeapiService: PokeapiService) {
  }


  /**
   * Calls functions to load the Pokemon Data from the API
   */
  ngOnInit() {
    this.pushPokemonColorsIntoArray();
    this.pushEvolutionListIntoArray();
    this.fillPokemonInfoList();
    this.handleSearchInput();
  }


  /**
   * Executes function after the HTML is loaded
   */
  ngAfterViewInit(): void {
    this.loadingDotsAnimation();
  }


  /**
   * Animates the dots to show loadin progress
   */
  loadingDotsAnimation() {
    try {
      let container = document.getElementById("loadingDots") as HTMLSpanElement;
      container.innerHTML = ``;
      for (let i = 1; i <= 3; i++) {
        setTimeout(() => {
          container.innerHTML += `.`;
        }, i * 1000);
      }

      setTimeout(() => {
        container.innerHTML = ``;
        this.loadingDotsAnimation();
      }, 4000);
    } catch (e) {

    }
  }


  /**
   * Changes the value of a variable to hide/show the Loading Animation/Pokedex Cards
   */
  disableLoadingAnimation() {
    this.showLoader = false;
  }


  /**
   * Pushes requests into array, handles response from the requests
   */
  fillPokemonInfoList() {
    for (let i = 1; i <= 1025; i++) {
      this.requests.push(this.pokeapiService.getPokemonInfoList(i));
    }

    from(this.requests).pipe(
      mergeMap(request => request, 5),
      toArray()
    ).subscribe({
      next: (responses) => {
        this.restructurePokeData(responses);
        this.disableLoadingAnimation();
      },
      error: (err) => {
        console.error('Failed to fetch some Pokémon data', err);
      }
    });
  }


  /**
   * Restructuring the Data from the API to make it easier to use later
   * @param data JSON with all the pokemon info from the pokeAPI
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
   * Loads the Data of the Pokemon either unfiltered or filtered via Search Term
   */
  handleSearchInput() {
    if (this.searchTerm !== '') {
      this.filteredPokemonList = this.fullPokemonInfoList.filter(pokemon =>
        pokemon.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredPokemonList = this.fullPokemonInfoList;
    }
  }


  /**
   * Pushes requests into array. Skips empty entries. Handles response from the requests
   */
  pushEvolutionListIntoArray() {
    for (let i = 1; i <= 549; i++) {
      if (i == 210 || i == 222 || i == 225 || i == 226 || i == 227 || i == 231 || i == 238 || i == 251) {
        continue;
      } else {
        this.evoRequests.push(this.pokeapiService.getEvolutionInfoList(i));
      }
    }

    from(this.evoRequests).pipe(
      mergeMap(request => request, 5),
      toArray()
    ).subscribe({
      next: (responses) => {
        this.restructureEvolutionData(responses);
      },
      error: (err) => {
        console.error("Failed to fetch some Evolution data", err);
      }
    });
  }


  /**
   * Restructures the Evolution Data for easier use and pushes it into an array
   * @param data JSON containing the evolution Data from the PokeAPI
   */
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
    if (array.length == 0) {
      return ["No Data provided"];
    }

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
    document.body.style.overflow = "hidden";
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


  /**
   * Looks for empty entries in the Pokemon Array and sets a default color
   */
  givePokemonColor() {
    this.fullPokemonInfoList.map(pokemon => {
      if (pokemon.color == undefined || pokemon.color == "") {
        pokemon.color = 'default';
      }
    });
  }
}