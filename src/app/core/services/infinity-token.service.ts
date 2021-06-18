import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InfinityTokenService {

  constructor() { }

  saveToken(token: string): void {
    localStorage.setItem('tokenInfinity', token);
  }

  gettoken(): any {
    return localStorage.getItem('tokenInfinity');
  }
}
