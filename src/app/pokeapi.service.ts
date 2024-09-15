import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokeapiService {
  private singleUrl = 'https://pokeapi.co/api/v2/pokemon/';
  number: number = 0;

  constructor(private http: HttpClient) { }

  getPokemonInfoList(): Observable<any> {
    this.number++;
    return this.http.get(this.singleUrl + this.number);
  }
}
