import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, delayWhen, map, retry, retryWhen, shareReplay, tap } from 'rxjs/operators';
import { InfinityTokenService } from './infinity-token.service';

@Injectable({
  providedIn: 'root'
})
export class InfinityApiService {

  url = '';
  urlToken = '';
  value: any;
  tokenInfinity: any;
  urlInfinity = 'https://www.supertech.ec:8443/infinityone1/resources';

  constructor(
    private http: HttpClient,
    private its: InfinityTokenService,
  ) {
  }

  public getDataInfinity(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');

    console.log(headers);
    this.url = environment.urlGarantia;
    return this.http.get(`${this.url}/webresources/ejemplo`, { headers });
  }

  getDataF(): Observable<any> {
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

  public getTokenInfinity(): void {
    console.log('tokenInfinity');
    this.urlToken = environment.urlToken;
    this.url = environment.urlGarantia;
    const urlext = `${this.urlInfinity}/usuario/login?user=paul&password=paul123`;
    console.log(urlext);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', '');
    headers = headers.set('Access-Control-Allow-Headers', 'Authorization');
    this.http.get(urlext, { headers })
      .pipe(
        tap((data: any) => {
          const token = data;
          console.log(token.token);
          this.its.saveToken(token.token);
        }),
        shareReplay(),
        retry(3)
      ).subscribe(
        (re: any) => { console.log('HTTP response', re); },
        (err: any) => { console.log('HTTP Error', err); },
        () => { console.log('HTTP request completed.'); }
      );
  }

  public getTableInfinity(nombre: string): Observable<any> {
    console.log(this.tokenInfinity);
    this.tokenInfinity = localStorage.getItem('tokenInfinity');
    console.log(this.tokenInfinity);
    let headers = new HttpHeaders();
    if (this.tokenInfinity) {
      headers = headers.set('Content-Type', 'application/json');
      headers = headers.set('Authorization', this.tokenInfinity);
      headers = headers.set('Access-Control-Allow-Headers', 'Authorization');
    }
    return this.http.get<any>(
      `${this.urlInfinity}/ec.com.infinity.modelo.${nombre}`,
      { headers }
    ).pipe(
      tap((data: any) => {
        console.log(data);
      }),
      shareReplay(),
      retry(3)
    );
  }

  public getItemInfinity(nombre: string, item: any): Observable<any> {
    console.log(this.tokenInfinity);
    this.tokenInfinity = localStorage.getItem('tokenInfinity');
    // console.log(this.tokenInfinity);
    // let headers = new HttpHeaders();
    // headers = headers.set('Content-Type', 'application/json');
    // headers = headers.set('Authorization', this.tokenInfinity);
    // headers = headers.set('Access-Control-Allow-Headers', 'Authorization');

    // const raw = JSON.stringify(item);

    // const requestOptions = {
    //   headers,
    //   body: JSON.stringify(item)
    // };

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.tokenInfinity,
        'Access-Control-Allow-Headers': 'Authorization'
      }),
      body: item,
    };

    return this.http.get<any>(
      `${this.urlInfinity}/ec.com.infinity.modelo.${nombre}/porId`, options
    ).pipe(
      tap((data: any) => {
        console.log(data);
      }),
      shareReplay(),
      retry(3)
    );
  }

  public addDataTable(tabla: string, data: any): Observable<any> {
    console.log(data);
    this.tokenInfinity = localStorage.getItem('tokenInfinity');
    console.log(this.tokenInfinity);
    let headers = new HttpHeaders();
    // const prms = new HttpParams({ ...params });
    if (this.tokenInfinity) {
      headers = headers.set('Content-Type', 'application/json');
      headers = headers.set('Authorization', this.tokenInfinity);
      headers = headers.set('Access-Control-Allow-Headers', 'Authorization');
    }
    return this.http.put<any>(
      `${this.urlInfinity}/ec.com.infinity.modelo.${tabla}/porId`, data, { headers })
      .pipe(
        tap((d: any) => {
          console.log(d);
        }),
        shareReplay(),
        retry(3)
      );
  }

  // public addDataTable(tabla: string, params: any, data: any): Observable<any> {
  //   console.log(this.tokenInfinity);
  //   let headers = new HttpHeaders();
  //   // const prms = new HttpParams({ ...params });
  //   if (this.tokenInfinity) {
  //     headers = headers.set('Content-Type', 'application/json');
  //     headers = headers.set('Authorization', this.tokenInfinity);
  //     headers = headers.set('Access-Control-Allow-Headers', 'Authorization');
  //   }
  //   return this.http.post<any>(
  //     `${this.urlInfinity}/ec.com.infinity.modelo.${tabla}`, data, {
  //     headers,
  //     params
  //   }
  //   ).pipe(
  //     tap((d: any) => {
  //       console.log(d);
  //     }),
  //     shareReplay(),
  //     retry(3)
  //   );
  // }

  public editDataTable(tabla: string, data: any): Observable<any> {
    this.tokenInfinity = localStorage.getItem('tokenInfinity');
    console.log(this.tokenInfinity);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: '' + this.tokenInfinity,
        'Access-Control-Allow-Headers': 'Authorization'
      })
    };

    return this.http.put<any>(
      `${this.urlInfinity}/ec.com.infinity.modelo.${tabla}/porId`, data, httpOptions).pipe(
        tap((d: any) => {
          console.log(d);
        }),
        shareReplay(),
        retry(3)
      );
  }

  public deleteDataTable(tabla: string, data: any): Observable<any> {
    this.tokenInfinity = localStorage.getItem('tokenInfinity');
    console.log(this.tokenInfinity);
    let headers = new HttpHeaders();
    // const prms = new HttpParams({ ...params });
    if (this.tokenInfinity) {
      headers = headers.set('Content-Type', 'application/json');
      headers = headers.set('Authorization', this.tokenInfinity);
      headers = headers.set('Access-Control-Allow-Headers', 'Authorization');
    }

    const raw = JSON.stringify(data);

    const requestOptions = {
      headers,
      body: raw
    };

    return this.http.delete(
      `${this.urlInfinity}/ec.com.infinity.modelo.${tabla}/porId`, requestOptions).pipe(
        tap((d: any) => {
          console.log(d);
        }),
        shareReplay(),
        retry(3)
      );
  }
}
