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
  @Input() pokeInfo: any = {};

  constructor() {
    
  }

  ngOnInit(): void{
    console.log(this.pokeInfo);
  }
}
