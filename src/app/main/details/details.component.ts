import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  @Input() currentPokemonData: any = {
    abilities: '',
    base_experience: 0,
    game_indices: '',
    forms: '',
    id: 0,
    moves: '',
    name: '',
    species: '',
    sprites: '',
    stats: '',
    types: '',
    weight: 0
  };

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
    console.log(this.currentPokemonData);
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
