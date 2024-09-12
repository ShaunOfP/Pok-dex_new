import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokeapiService {
private apiUrl = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0";

  constructor(private http: HttpClient) { }

  getPokemonList(): Observable<any>{
    return this.http.get(this.apiUrl);
  }
}
