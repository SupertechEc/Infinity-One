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
  direccion = '';
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

  public consultasPrueba(): Promise<string>{
    const response = this.http.get('https://www.supertech.ec:8443/WebApplication2/api/holaMundo', { responseType: 'text'}).toPromise();
    return response;
  }
  public consultasPrueba2(): Promise<string>{
    this.direccion = 'https://www.supertech.ec:8443/infinityone/resources/prueba';
    const prueba = this.http.get(`${this.direccion}`, { responseType: 'text'}).toPromise();
    return prueba;
  }

  getDataPrueba(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', 'Infinity eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwYXVsIiwiaXNzIjoiZWMuY29tLmluZmluaXR5b25lIiwiaWF0IjoxNjIyNjU2NzU3LCJleHAiOjE2MjI2NjAzNTd9.MSNl4EhUwhAg0O8cGktqTIlKvCZPTxDRwkqzwi2o7YFcxMNmptSJMz4RJZd8sxJ6WzOhb8b-kiwGgzPwSxjraQ');
    headers = headers.set('Access-Control-Allow-Headers', 'Authorization');
    return this.http.get('https://www.supertech.ec:8443/infinityone1/resources/ec.com.infinity.modelo.areamercadeo', { headers});
    //return this.http.get('http://localhost:8082/infinityone1/resources/ec.com.infinity.modelo.areamercadeo', { headers});
  }
}
