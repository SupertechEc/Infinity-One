import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InfinityApiService {

  url = '';
  constructor(
    private http: HttpClient
  ) { }

  public getDataInfinity(): Observable<any> {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    //   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    //   'Access-Control-Allow-Origin': '*'
    // });
    // .append('Content-Type', 'application/json')
    // .append('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization')
    // .append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    // .append('Access-Control-Allow-Origin', '*');

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');

    console.log(headers);
    this.url = environment.urlGarantia;
    return this.http.get(`${this.url}/webresources/ejemplo`, { headers });
    //return this.http.get<any>('/ConsumidorWS_SOAP/webresources/ejemplo');
    // return this.http.get<any>('https://pokeapi.co/api/v2/pokemon/ditto');
    //return this.http.get<any>('http://localhost:8082/ConsumidorWS_SOAP/webresources/ejemplo');
  }

  getDataF(): Observable<any> {
    // return this.http.get<any>('http://localhost:8082/ConsumidorWS_SOAP/webresources/ejemplo');
    this.url = environment.urlGarantia;
    return this.http.get<any>(`${this.url}/webresources/consultarfacturaunica?codcom=2&fecha=20210512`);
  }

  public ConsultaDireccionTodos(fecha: any): Observable<any> {
    this.url = environment.urlGarantia;
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    const params = new HttpParams()
      .set('codcom', '2')
      .set('fecha', fecha);
    return this.http.get(`${this.url}/webresources/consultarfacturaunica`, { headers, params });
  //  return this.http.get(this.direcc, { headers: headers, params: params });
  }

  public consultasPrueba(): Observable<any>{
    return this.http.get<any>('https://www.supertech.ec:8443/WebApplication2/api/holaMundo');
  }
}
