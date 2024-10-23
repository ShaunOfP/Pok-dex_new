import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokeapiService {
  private singleUrl = 'https://pokeapi.co/api/v2/pokemon/';
  private evoUrl = `https://pokeapi.co/api/v2/evolution-chain/`;
  private colorUrl = `https://pokeapi.co/api/v2/pokemon-color/`;
  colorCounter: number = 0;


  constructor(private http: HttpClient) { }

  getPokemonInfoList(number: number): Observable<any> {
    return this.http.get(this.singleUrl + number);
  }


  getEvolutionInfoList(evoCounter: number): Observable<any> {
    return this.http.get(this.evoUrl + evoCounter);
  }


  getColorsOfPokemon(): Observable<any> {
    this.colorCounter++;
    return this.http.get(this.colorUrl + this.colorCounter);
  }
}