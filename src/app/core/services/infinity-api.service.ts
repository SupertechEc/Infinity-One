import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InfinityApiService {

  url = '';

  constructor(
    private http: HttpClient
  ) { }

  getDataInfinity(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Origin': '*'
    });
    // .append('Content-Type', 'application/json')
    // .append('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization')
    // .append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    // .append('Access-Control-Allow-Origin', '*');
    console.log(headers);
    this.url = environment.urlGarantia;
    return this.http.get<any>(`${this.url}/webresources/ejemplo`, { headers });
    // return this.http.get<any>('/ConsumidorWS_SOAP/webresources/ejemplo');
    // return this.http.get<any>('https://pokeapi.co/api/v2/pokemon/ditto');
  }
}
