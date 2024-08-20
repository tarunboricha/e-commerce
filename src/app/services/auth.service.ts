import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Seller, User } from '../data-type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authFailedMessage = new EventEmitter<string>(undefined);
  authSucessMessage = new EventEmitter<string>(undefined);
  baseURL: string = 'https://2f87-2401-4900-65cb-3ba5-209-64a3-654d-663f.ngrok-free.app';

  constructor(private http: HttpClient) { }

  sellerSignIn(email: string, password: string) {
    return this.http.get<Seller[]>(`${this.baseURL}/seller/${email}/${password}`);
  }

  userSignIn(email: string, password: string) {
    return this.http.get<User[]>(`${this.baseURL}/users/${email}/${password}`);
  }

  userSignUp(user: User) {
    return this.http.post(`${this.baseURL}/users`, user);
  }
}
