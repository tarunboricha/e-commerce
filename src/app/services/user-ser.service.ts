import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    return this.htttp.post('https://a7c2-2409-4041-2615-445d-3042-dd3a-fb94-f97.ngrok-free.app/users',
            data, { headers: this.headers, observe: 'response' });
  }
  UserLoginservice(data: Login) {
    return this.htttp.get(`https://a7c2-2409-4041-2615-445d-3042-dd3a-fb94-f97.ngrok-free.app/users/${data.email}/${data.password}`,
      { headers: this.headers, observe: 'response' });
  }
}
