import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {Login, signUp } from '../data-type';

@Injectable({
  providedIn: 'root'
})
export class UserSerService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YourAccessToken', // Add any other headers you need
    'ngrok-skip-browser-warning': 'your-custom-value'
  });
  constructor(private htttp: HttpClient, private router: Router) { }
  userSignupservice(data: signUp) {
    return this.htttp.post('https://1ef0-2409-4041-2d9e-4268-3d1f-3091-b785-16a.ngrok-free.app/users',
            data, { headers: this.headers, observe: 'response' });
  }
  UserLoginservice(data: Login) {
    return this.htttp.get(`https://1ef0-2409-4041-2d9e-4268-3d1f-3091-b785-16a.ngrok-free.app/users/${data.email}/${data.password}`,
      { headers: this.headers, observe: 'response' });
  }
}
