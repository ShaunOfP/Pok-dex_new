import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokeapiService {
  private singleUrl = 'https://pokeapi.co/api/v2/pokemon/';
  number: number = 0;
  private evoUrl = `https://pokeapi.co/api/v2/evolution-chain/`;
  evoCounter: number = 0;
  private colorUrl = `https://pokeapi.co/api/v2/pokemon-color/`;
  colorCounter: number = 0;


  constructor(private http: HttpClient) { }

  getPokemonInfoList(): Observable<any> {
    this.number++;
    return this.http.get(this.singleUrl + this.number);
  }


  getEvolutionInfoList(): Observable<any> {
    this.evoCounter++;
    if (this.evoCounter == 210 || this.evoCounter == 222 || this.evoCounter == 225 || this.evoCounter == 226 || this.evoCounter == 227 || this.evoCounter == 231 || this.evoCounter == 238 || this.evoCounter == 251) {
      this.getEvolutionInfoList();
    }
    return this.http.get(this.evoUrl + this.evoCounter);
  }

  
  getColorsOfPokemon(): Observable<any>{
    this.colorCounter++;
    return this.http.get(this.colorUrl + this.colorCounter);
  }
}