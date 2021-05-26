import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, tap } from 'rxjs/operators';
import { InfinityTokenService } from './infinity-token.service';

@Injectable({
  providedIn: 'root'
})
export class InfinityApiService {

  url = '';
  urlToken = '';

  constructor(
    private http: HttpClient,
    private its: InfinityTokenService,
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
    // return this.http.get<any>('/ConsumidorWS_SOAP/webresources/ejemplo');
    // return this.http.get<any>('https://pokeapi.co/api/v2/pokemon/ditto');
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
    // headers = headers.set('Authorization', "Bearer " + obj.Token);
    const params = new HttpParams()
      .set('codcom', '2')
      .set('fecha', fecha);
    return this.http.get(`${this.url}/webresources/consultarfacturaunica`, { headers, params });
  }

  public faturasPorTipo(fecha: any, tipo: any): Observable<any> {
    this.url = environment.urlGarantia;
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    const params = new HttpParams()
      .set('codcom', '2')
      .set('fecha', fecha);
    return this.http.get(`${this.url}/webresources/consultarfacturaunica`, { headers, params })
      .pipe(
        map((res: any) => {
          return res.filter((post: any) => {
            return post.estadoPago = tipo;
          });
        })
      );
  }

  public getTokenInfinity(): Observable<any> {
    console.log('tokenInfinity');
    this.urlToken = environment.urlToken;
    return this.http.get(`${this.urlToken}/resources/usuario/login?user=paul&password=paul123`)
      .pipe(
        tap((data: any) => {
          const token = data;
          console.log(token);
          this.its.saveToken(token);
        })
      );
  }

  public getTableInfinity(nombre: string): Observable<any> {
    this.urlToken = environment.urlToken;
    const tokenInfinity = localStorage.getItem('tokenInfinity');
    console.log(tokenInfinity);
    let headers = new HttpHeaders();
    if (tokenInfinity) {
      headers = headers.set('Authorization', tokenInfinity);
    }
    return this.http.get<any>(
      `${this.urlToken}/resources/ec.com.infinity.modelo.${nombre}`,
      { headers }
    );
  }
}
