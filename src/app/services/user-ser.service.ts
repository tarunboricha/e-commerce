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
    return this.htttp.post('https://abe9-2405-204-800a-c9e4-6d75-6c52-7954-cedd.ngrok-free.app/users',
            data, { headers: this.headers, observe: 'response' });
  }
  UserLoginservice(data: Login) {
    return this.htttp.get(`https://abe9-2405-204-800a-c9e4-6d75-6c52-7954-cedd.ngrok-free.app/users/${data.email}/${data.password}`,
      { headers: this.headers, observe: 'response' });
  }
}
