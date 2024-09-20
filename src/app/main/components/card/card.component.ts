import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() pokeName = '';
  @Input() pokeId = 0;
  @Input() pokeSprite = '';
  @Input() typeOne = '';
  @Input() typeTwo = '';
  @Input() pokeInfo = {
    abilities: [],
    base_experience: 64,
    forms: [],
    id: 1,
    moves: [],
    name: 'bulbasaur',
    sprites: [],
    stats: [],
    types: [],
    weight: 69
  };
}
