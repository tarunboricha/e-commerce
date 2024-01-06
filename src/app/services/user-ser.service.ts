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
    data.userID = 0;
    if (data.name != '' && data.email != '' && data.password != '') {
      this.htttp.post('https://1763-103-250-162-221.ngrok-free.app/users',
        data, { headers: this.headers, observe: 'response' }).subscribe((result) => {
          this.router.navigate(['']);
        });
    }
  }
  UserLoginservice(data: Login) {
    return this.htttp.get(`https://1763-103-250-162-221.ngrok-free.app/users/${data.email}/${data.password}`,
      { headers: this.headers, observe: 'response' });
  }
}
