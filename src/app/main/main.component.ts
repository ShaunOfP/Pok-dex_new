import { Component, OnInit } from '@angular/core';
import { PokeapiService } from '../pokeapi.service';
import { HttpClientModule } from '@angular/common/http';
import { CardComponent } from './components/card/card.component';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from "./details/details.component";
import { Pokemon } from '../pokemon.class';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HttpClientModule, CardComponent, CommonModule, DetailsComponent],
  providers: [PokeapiService],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})

export class MainComponent implements OnInit {
  fullPokemonInfoList: Array<any> = [];
  currentPokemonData: Pokemon = new Pokemon();
  spriteNumber: number = 0;


  constructor(private pokeapiService: PokeapiService) {
  }


  ngOnInit() {
    this.fillPokemonInfoList();
    this.fillEvolutionInfoList();
    // console.log(this.fullPokemonInfoList);
  }


  /**
   * Last entry in API is 1025
   */
  fillPokemonInfoList() {
    for (let i = 0; i < 1025; i++) {
      this.pokeapiService.getPokemonInfoList().subscribe({
        next: (data) => {
          data = {
            abilities: this.searchDataSubArrayForValues(data.abilities, 'ability', 'name'),
            base_experience: data.base_experience,
            game_indices: this.searchDataSubArrayForValues(data.game_indices, 'version', 'name'),
            forms: this.searchDataSubArrayForValues(data.forms, '', 'name'),
            id: data.id,
            formattedId: this.formatNumber(data.id),
            moves: this.searchDataSubArrayForValues(data.moves, 'move', 'name'),
            name: this.capitalizeFirstLetter(data.name),
            species: data.species,
            sprites: data['sprites']['other']['official-artwork']['front_default'],
            stats: data.stats,
            types: this.searchDataSubArrayForValues(data.types, 'type', 'name'),
            weight: data.weight,
            evolution: ''
          };
          this.fullPokemonInfoList.push(data);
        },
        error: (error) => {
          console.error('There was an error retrieving the Pokemon Data from the API!', error);
        }
      });
    }
  }


  /**
   * 541 because: last filled index on the api is 549, but we need to subtract 7 because we skip 7 empty entries in the getEvolutionInfoList-function in the pokeapi.service.ts
   */
  fillEvolutionInfoList() {
    for (let i = 0; i < 541; i++) {
      this.pokeapiService.getEvolutionInfoList().subscribe({
        next: (data) => {
          if (data.chain['evolves_to'] == 0) {
            data = [
              {
                name: this.capitalizeFirstLetter(data.chain['species']['name']),
                spriteNr: this.generateSpriteNumber()
              },
              {
                name: '',
                spriteNr: ''
              },
              {
                name: '',
                spriteNr: ''
              }
            ];
          } else if (data.chain['evolves_to'][0]['evolves_to'] == 0) {
            data = [
              {
                name: this.capitalizeFirstLetter(data.chain['species']['name']),
                spriteNr: this.generateSpriteNumber()
              },
              {
                name: this.capitalizeFirstLetter(data.chain['evolves_to'][0]['species']['name']),
                spriteNr: this.generateSpriteNumber()
              },
              {
                name: '',
                spriteNr: ''
              }
            ];
          } else {
            data = [
              {
                name: this.capitalizeFirstLetter(data.chain['species']['name']),
                spriteNr: this.generateSpriteNumber()
              },
              {
                name: this.capitalizeFirstLetter(data.chain['evolves_to'][0]['species']['name']),
                spriteNr: this.generateSpriteNumber()
              },
              {
                name: this.capitalizeFirstLetter(data.chain['evolves_to'][0]['evolves_to'][0]['species']['name']),
                spriteNr: this.generateSpriteNumber()
              }
            ];
          }
          this.sortEvolutionToPokemonData(data);
        },
        error: (error) => {
          console.error('There was an error retrieving the Evolution Data from the API!', error);
        }
      });
    }
  }


  generateSpriteNumber() {
    this.spriteNumber++;
    return this.spriteNumber;
  }


  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


  formatNumber(value: number): string {
    return value.toString().padStart(3, '0');
  }


  searchDataSubArrayForValues(array: string[], searchValue1: string, searchValue2: string) {
    return array.map((item: any) => {
      if (searchValue1 == '' || searchValue1 == null) {
        return item[searchValue2] = this.capitalizeFirstLetter(item[searchValue2]);
      } else {
        return item[searchValue1][searchValue2] = this.capitalizeFirstLetter(item[searchValue1][searchValue2]);
      }
    });
  }


  setCurrentPokemonData(pokemonData: Pokemon) {
    this.currentPokemonData = pokemonData;
    document.getElementById('details')?.classList.remove('dp-none');
  }


  /**
   * Überarbeiten weil zu oft aufgerufen
   * @param evolutionData Data of the evolution chain
   */
  sortEvolutionToPokemonData(evolutionData: any) {
    this.fullPokemonInfoList.forEach(pokemon => {
      if (pokemon.name == evolutionData[0]['name'] || pokemon.name == evolutionData[1]['name'] || pokemon.name == evolutionData[2]['name']) {
        pokemon.evolution = evolutionData;
      }
    });
  }
}