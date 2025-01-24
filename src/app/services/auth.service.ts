import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Seller, User } from '../data-type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authFailedMessage = new EventEmitter<string>(undefined);
  authSucessMessage = new EventEmitter<string>(undefined);
  baseURL: string = 'https://ba59-2401-4900-4e6f-4a77-c11e-8f2d-9719-639d.ngrok-free.app';

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
