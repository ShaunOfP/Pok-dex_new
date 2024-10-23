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


  /**
   * Retrieves the Pokemon Info with all the Details from the PokeAPI
   * @param number A number
   * @returns An Array with all the information about one Pokemon
   */
  getPokemonInfoList(number: number): Observable<any> {
    return this.http.get(this.singleUrl + number);
  }


  /**
   * Retrieves the Evolution Lists from the PokeAPI
   * @param evoCounter A number
   * @returns An Array with all the Evolutions of the first Group
   */
  getEvolutionInfoList(evoCounter: number): Observable<any> {
    return this.http.get(this.evoUrl + evoCounter);
  }


  /**
   * Retrieves the Color List from the PokeAPI
   * @returns An Array which contains the Color-Code and all the matching Pokemon for this Color-Code
   */
  getColorsOfPokemon(): Observable<any> {
    this.colorCounter++;
    return this.http.get(this.colorUrl + this.colorCounter);
  }
}