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

  constructor() {
    console.log("Im loaded");
    console.log(this.currentPokemonData);
  }

  loadAbout() {

  }

  loadStats() {

  }

  loadEvo() {

  }

  loadMoves() {

  }
}
