import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { signUp, Login } from '../data-type';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SellerSerService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YourAccessToken', // Add any other headers you need
    'ngrok-skip-browser-warning': 'your-custom-value'
  });

  serverError: boolean = false;
  SellerLoginFailed = new EventEmitter<boolean>(false);
  checkSellerlogin = new BehaviorSubject<boolean>(false);
  constructor(private htttp: HttpClient, private router: Router) { }

  sellerReloadpage() {
    if (localStorage.getItem('seller')) {
      this.checkSellerlogin.next(true);
      this.router.navigate(['seller-homepage']);
    }
  }
  sellerLoginservice(data: Login) {
    return this.htttp.get(`https://2384-2409-4041-2615-445d-3042-dd3a-fb94-f97.ngrok-free.app/seller/${data.email}/${data.password}`,
      { headers: this.headers, observe: 'response' });
  }
}
