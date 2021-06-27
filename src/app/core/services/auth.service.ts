import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { InfinityApiService } from './infinity-api.service';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1';
  private apiKey = 'AIzaSyANKklM4lBcbY37zku61cC9PSgVpHLRSrw';
  userToken = '';

  // Crear nuevos usuarios
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  // Login
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor(
    private http: HttpClient,
    private af: AngularFireAuth,
    private api: InfinityApiService,
    private ls: LocalstorageService
  ) {
    this.readToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenInfinity');
    localStorage.removeItem('email');
  }

  login(usuario: any): Observable<any> {
    const authData = {
      ...usuario,
      returnSecureToken: true
    };
    return this.http.post(
      `${this.url}/accounts:signInWithPassword?key=${this.apiKey}`, authData
    ).pipe(
      map(resp => {
        console.log('Entro en el mapa del RXJS');
        this.saveToken(resp);
        return resp;
      })
    );
  }

  newUser(usuario: any): Observable<any> {
    const authData = {
      ...usuario,
      returnSecureToken: true
    };
    return this.http.post(
      `${this.url}/accounts:signUp?key=${this.apiKey}`, authData
    );
  }

  authUser(email: string, password: string): Promise<any> {
    return this.af.signInWithEmailAndPassword(email, password);
  }

  private saveToken(user: any): void {
    this.userToken = user.idToken;
    localStorage.setItem('token', user.idToken);

    const hoy = new Date();
    hoy.setSeconds(3600);
    localStorage.setItem('expira', hoy.getTime().toString());
    localStorage.removeItem('tokenInfinity');
    console.log(localStorage.getItem('tokenInfinity'));
    this.api.getTokenInfinity();
  }

  readToken(): string {
    if (localStorage.getItem('token')) {
      this.userToken = '' + localStorage.getItem('token');
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }

  isAuthenticated(): boolean {

    if (this.userToken.length < 2) {
      return false;
    }

    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);
    if (expiraDate > new Date()) {
      return true;
    } else {
      this.ls.clear();
      return false;
    }
  }

}
