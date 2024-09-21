import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

interface Pokemon {
  abilities: [];
  base_experience: number;
  forms: [];
  id: number;
  moves: [];
  name: string;
  sprites: [];
  stats: [];
  types: [];
  weight: number;
}

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() pokeInfo: any = {};

  constructor() {
    
  }

  ngOnInit(): void{
    console.log(this.pokeInfo);
  }
}
