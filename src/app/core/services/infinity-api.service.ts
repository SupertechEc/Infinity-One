import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfinityApiService {

  constructor(
    private http: HttpClient
  ) { }

  getDataInfinity(): Observable<any> {
    return this.http.get<any>('http://localhost:8082/ConsumidorWS_SOAP/webresources/ejemplo');
  }
}
