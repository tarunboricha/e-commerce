import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Seller, User } from '../data-type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authFailedMessage = new EventEmitter<string>(undefined);
  authSucessMessage = new EventEmitter<string>(undefined);
  baseURL: string = 'https://bf2d-103-250-162-216.ngrok-free.app';

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
