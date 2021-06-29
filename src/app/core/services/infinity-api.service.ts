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
    debugger;
    console.log(this.tokenInfinity);
    this.tokenInfinity = localStorage.getItem('tokenInfinity');
    console.log(this.tokenInfinity);
    let headers = new HttpHeaders();
    if (this.tokenInfinity) {
      headers = headers.set('Content-Type', 'application/json');
      headers = headers.set('Authorization', this.tokenInfinity);
      headers = headers.set('Access-Control-Allow-Headers', 'Authorization');
    }
    return this.http
      .get<any>(`${this.urlInfinity}/ec.com.infinity.modelo.${nombre}`, {
        headers,
      })
      .pipe(
        tap((data: any) => {
          console.log(data);
        }),
        shareReplay(),
        retry(3)
      );
  }

  public getClienteProducto(nombre: string, item: any): Observable<any> {
    console.log(this.tokenInfinity);
    this.tokenInfinity = localStorage.getItem('tokenInfinity');
    console.log(this.tokenInfinity);
    let headers = new HttpHeaders();
    if (this.tokenInfinity) {
      headers = headers.set('Content-Type', 'application/json');
      headers = headers.set('Authorization', this.tokenInfinity);
      headers = headers.set('Access-Control-Allow-Headers', 'Authorization');
    }
    return this.http
      .get<any>(
        `${this.urlInfinity}/ec.com.infinity.modelo.${nombre}/porCliente?codigocliente=${item}`,
        {
          headers,
        }
      )
      .pipe(
        tap((data: any) => {
          console.log(data);
        }),
        shareReplay(),
        retry(3)
      );
  }

  public getNotasPedidos(
    nombre: string,
    codAbas: any,
    codComer: any,
    codTerminal: any,
    tipoFecha: any,
    fecha: any
  ): Observable<any> {
    console.log(this.tokenInfinity);
    this.tokenInfinity = localStorage.getItem('tokenInfinity');
    console.log(this.tokenInfinity);
    let headers = new HttpHeaders();
    if (this.tokenInfinity) {
      headers = headers.set('Content-Type', 'application/json');
      headers = headers.set('Authorization', this.tokenInfinity);
      headers = headers.set('Access-Control-Allow-Headers', 'Authorization');
    }
    return this.http
      .get<any>(
        `${this.urlInfinity}/ec.com.infinity.modelo.${nombre}/paraFactura?codigoabastecedora=${codAbas}&codigocomercializadora=${codComer}&codigoterminal=${codTerminal}&tipofecha=${tipoFecha}&fecha=${fecha}`,
        {
          headers,
        }
      )
      .pipe(
        tap((data: any) => {
          console.log(data);
        }),
        shareReplay(),
        retry(3)
      );
  }

  // tslint:disable-next-line:max-line-length
  public getListaPrecios(nombre: string, codComer: any, codTerminal: any, codProducto: any, codMedida: any, codListaPrecio: any, fecha: any): Observable<any> {
    console.log(this.tokenInfinity);
    this.tokenInfinity = localStorage.getItem('tokenInfinity');
    console.log(this.tokenInfinity);
    let headers = new HttpHeaders();
    if (this.tokenInfinity) {
      headers = headers.set('Content-Type', 'application/json');
      headers = headers.set('Authorization', this.tokenInfinity);
      headers = headers.set('Access-Control-Allow-Headers', 'Authorization');
    }
    return this.http
      .get<any>(
        `${this.urlInfinity}/ec.com.infinity.modelo.${nombre}/paraFactura?codigocomercializadora=${codComer}
      &codigoterminal=${codTerminal}&codigoproducto=${codProducto}&codigomedida=${codMedida}&codigolistaprecio=${codListaPrecio}&fechainicio=${fecha}`,
        {
          headers,
        }
      )
      .pipe(
        tap((data: any) => {
          console.log(data);
        }),
        shareReplay(),
        retry(3)
      );
  }

  public getDetallePrecio(nombre: string, codPrecio: any): Observable<any> {
    console.log(this.tokenInfinity);
    this.tokenInfinity = localStorage.getItem('tokenInfinity');
    console.log(this.tokenInfinity);
    let headers = new HttpHeaders();
    if (this.tokenInfinity) {
      headers = headers.set('Content-Type', 'application/json');
      headers = headers.set('Authorization', this.tokenInfinity);
      headers = headers.set('Access-Control-Allow-Headers', 'Authorization');
    }
    return this.http
      .get<any>(
        `${this.urlInfinity}/ec.com.infinity.modelo.${nombre}/paraFactura?codigo=${codPrecio}`,
        {
          headers,
        }
      )
      .pipe(
        tap((data: any) => {
          console.log(data);
        }),
        shareReplay(),
        retry(3)
      );
  }

  public getItemInfinity(nombre: string, item: any): Observable<any> {
    debugger;
    console.log(item);
    this.tokenInfinity = localStorage.getItem('tokenInfinity');
    console.log(this.tokenInfinity);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', this.tokenInfinity);
    headers = headers.set('Access-Control-Allow-Headers', 'Authorization');

    let params = new HttpParams()
    for (let key in item) {
      console.log('Etiqueta: ' + key + ' valor: ' + item[key]);
      params = params.set(key, item[key]);
    }

    console.log(params);

    return this.http
      .get<any>(`${this.urlInfinity}/ec.com.infinity.modelo.${nombre}/porId`, {
        headers,
        params,
      })
      .pipe(
        tap((data: any) => {
          console.log(data);
        }),
        shareReplay(),
        retry(3)
      );
  }

  public getItemInfinityPK(
    nombre: string,
    item: any,
    cod: any
  ): Observable<any> {
    console.log(item);
    this.tokenInfinity = localStorage.getItem('tokenInfinity');
    console.log(this.tokenInfinity);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', this.tokenInfinity);
    headers = headers.set('Access-Control-Allow-Headers', 'Authorization');
    return this.http
      .get<any>(
        `${this.urlInfinity}/ec.com.infinity.modelo.${nombre}/porId?codigocomercializadora=${item}&codigo=${cod}`,
        { headers }
      )
      .pipe(
        tap((data: any) => {
          console.log(data);
        }),
        shareReplay(),
        retry(3)
      );
  }

  public addDataTable(tabla: string, data: any, tipo: number): Observable<any> {
    this.tokenInfinity = localStorage.getItem('tokenInfinity');
    let urlAction = '';
    console.log(this.tokenInfinity);
    console.log(data);
    console.log(JSON.stringify(data));
    let headers = new HttpHeaders();
    // const prms = new HttpParams({ ...params });
    if (this.tokenInfinity) {
      headers = headers.set('Content-Type', 'application/json');
      headers = headers.set('Authorization', this.tokenInfinity);
      headers = headers.set('Access-Control-Allow-Headers', 'Authorization');
    }
    /*return this.http.post<any>(
      //`${this.urlInfinity}/ec.com.infinity.modelo.${tabla}/porId`, data, { headers })
      `${this.urlInfinity}/ec.com.infinity.modelo.${tabla}`, data, { headers })
      .pipe(
        tap((d: any) => {
          console.log(d);
        }),
        shareReplay(),
        retry(3)
      );*/
    if (tipo === 1) {
      urlAction = `${this.urlInfinity}/ec.com.infinity.modelo.${tabla}/porId`;
      return this.http.put<any>(urlAction, data, { headers }).pipe(
        tap((d: any) => {
          console.log(d);
        }),
        shareReplay(),
        retry(3)
      );
    } else {
      urlAction = `${this.urlInfinity}/ec.com.infinity.modelo.${tabla}`;
      return this.http.post<any>(urlAction, data, { headers }).pipe(
        tap((d: any) => {
          console.log(d);
        }),
        shareReplay(),
        retry(3)
      );
    }
  }

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

    let params = new HttpParams()
    for (let key in data) {
      console.log(key.indexOf('codigo'))
      if (key.indexOf('codigo') >= 0) {
        console.log('Etiqueta: ' + key + ' valor: ' + data[key]);
        params = params.set(key, data[key]);
      }
    }

    console.log(params)

    return this.http.delete(
      `${this.urlInfinity}/ec.com.infinity.modelo.${tabla}/porId`, { headers, params }).pipe(
        tap((d: any) => {
          console.log(d);
        }),
        shareReplay(),
        retry(3)
      );
  }
}
