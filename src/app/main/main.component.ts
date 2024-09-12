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
  pokeInfoList: any;
  pokeNameList: string[] = [];

  constructor(private pokeapiService: PokeapiService) {
  }

  ngOnInit() {
    this.pokeapiService.getPokemonList().subscribe({
      next: (data) => {
        this.pokeInfoList = data['results'];
        this.fillPokeNameList();
      },
      error: (error) => {
        console.error('There was an error!', error);
      }
    });
  }

  fillPokeNameList() {
    for (let i = 0; i < this.pokeInfoList.length; i++) {
      this.pokeNameList.push(this.pokeInfoList[i]['name']);
    }
  }
}
