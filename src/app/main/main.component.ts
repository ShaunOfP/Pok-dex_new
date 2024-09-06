import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})

export class MainComponent implements OnInit {
  pokeInfo: Object[] = [];

  constructor() {

  }

  ngOnInit() {
    this.fetchData();
    this.showData();
  }

  async fetchData() {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0`);
      const data = await response.json();
      this.pokeInfo.push(data);
    } catch (e) {
      console.log('There was a problem fetching the data: ', e);
    }
  }

  showData() {
    console.log(this.pokeInfo[0]);
  }
}
