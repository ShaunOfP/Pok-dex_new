import { Component, OnInit } from '@angular/core';
import { PokeapiService } from '../pokeapi.service';
import { HttpClientModule } from '@angular/common/http';
import { CardComponent } from './components/card/card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HttpClientModule, CardComponent, CommonModule],
  providers: [PokeapiService],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})

export class MainComponent implements OnInit {
  pokeNameList: string[] = [];
  fullPokemonInfoList: object[] = [];

  constructor(private pokeapiService: PokeapiService) {
  }

  ngOnInit() {
    this.fillPokemonInfoList();
    console.log(this.fullPokemonInfoList);
  }

  fillPokemonInfoList(){
    for (let i = 0; i < 1025; i++){
      this.pokeapiService.getPokemonInfoList().subscribe({
        next: (data) => {
          this.fullPokemonInfoList.push(data);
          this.pokeNameList.push(this.capitalizeFirstLetter(data['name']));
        },
        error: (error) => {
          console.error('There was an error!', error);
        }
      });
    }
  }

  capitalizeFirstLetter(string: string){
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
