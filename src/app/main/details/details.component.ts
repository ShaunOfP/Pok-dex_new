import { CommonModule } from '@angular/common';
import { Component, Input, HostListener } from '@angular/core';
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
  hasEvolution: number = 1;
  menuNumber: number = 1;
  isResizing: Boolean = false;
  startY: number = 0;
  initialHeight: number = 250;

  constructor() {
  }


  /**
   * Initializes the start of the touch event by tracking, where the touch happened and enabling further resizing
   * @param event The Touchevent "Touchstart"
   */
  onTouchStart(event: TouchEvent) {
    this.isResizing = true;
    this.startY = event.touches[0].clientY;
  }


  /**
   * Calculates the new Height of the touched Element. If it is in a certain range it sets the new Height for the touched Element
   * @param event The Touchevent "Touchmove"
   * @returns nothing when resizing is not enabled
   */
  onTouchMove(event: TouchEvent) {
    if (!this.isResizing) return;

    const touchY = event.touches[0].clientY;
    const newHeight = this.initialHeight + (this.startY - touchY);

    if (newHeight >= 250 && newHeight <= 600) {
      const container = document.getElementById('lowerContainer') as HTMLElement;
      container.style.height = `${newHeight}px`;
    }
  }


  /**
   * When the touch ends and the resizing is enabled: Disables the resizing and set the initial Height to the current Height
   */
  @HostListener('document:touchend')
  onTouchEnd() {
    if (this.isResizing) {
      this.isResizing = false;
      this.initialHeight = parseInt((document.getElementById('lowerContainer') as HTMLElement).style.height, 10);
    }
  }


  /**
   * Sets the menuNumber
   */
  loadAbout() {
    this.menuNumber = 1;
  }


  /**
   * Sets the menuNumber
   */
  loadStats() {
    this.menuNumber = 2;
  }


  /**
   * Sets the menuNumber and calls the function to load the Pokemon Evolution Pictures
   */
  loadEvo() {
    this.menuNumber = 3;
    if (this.currentPokemonData['evolution'].length != 0) {
      this.loadPokemonSpriteForEvolution(this.currentPokemonData['evolution'][0][0], 0);
      this.loadPokemonSpriteForEvolution(this.currentPokemonData['evolution'][0][1], 1);
      this.loadPokemonSpriteForEvolution(this.currentPokemonData['evolution'][0][2], 2);
    } else {
      this.hasEvolution = 0;
      this.currentPokemonData['evolution'] = ["This Pokemon does not evolve"];
    }
  }


  /**
   * Sets the menuNumber
   */
  loadMoves() {
    this.menuNumber = 4;
  }


  /**
   * Used to remove the Details Overlay and reset the menuNumber
   */
  removeDetailsOverlay() {
    this.menuNumber = 1;
    this.hasEvolution = 1;
    document.getElementById('details')?.classList.add('dp-none');
    document.body.style.overflow = "visible";
  }


  /**
   * Takes in a string and returns the same string with its first letter capitalized
   * @param string Provided string/word
   * @returns String with first letter uppercase
   */
  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


  /**
   * Checks for the currentPokemon in the evolution list
   * @param pokemonEvolution A strin containin the name of the pokemon evolution
   * @returns True or False
   */
  currentPokemonIsNotDisplayedInEvolutions(pokemonEvolution: string) {
    if (pokemonEvolution != this.currentPokemonData['name']) {
      return true;
    } else {
      return false;
    }
  }


  /**
   * Loads the imagepaths of the currentPokemon-evolutions into variables
   * @param pokename String containing the name of a Pokemon
   * @param id A number for switch case purpose only
   */
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


  /**
   * Overwrites the currentPokemonData variable to select a new currentPokemon; called when an evolution is clicked
   * @param pokemonName Name of a Pokemon
   */
  setNewCurrentPokemon(pokemonName: string) {
    this.fullPokemonList.filter(singlePokemon => {
      if (singlePokemon.name == pokemonName) {
        this.currentPokemonData = singlePokemon;
      }
    });
  }
}
