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

  menuNumber: number = 1;

  constructor() {
  }

  loadAbout() {
    this.menuNumber = 1;
    console.log(this.currentPokemonData['evolution']);
  }

  loadStats() {
    this.menuNumber = 2;
  }

  loadEvo() {
    this.menuNumber = 3;
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
}
