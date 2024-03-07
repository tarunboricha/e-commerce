import { Component, OnInit } from '@angular/core';
import { SellerSerService } from '../services/seller-ser.service';
import { Login } from '../data-type';
import { Router } from '@angular/router';
import { ProductSerService } from '../services/product-ser.service';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.css']
})
export class SellerComponent implements OnInit {

  isLoader: boolean = false;
  SellerLoginfailed: undefined | string;
  constructor(private sellsign: SellerSerService, private router: Router, private product:ProductSerService) { }
  ngOnInit(): void {
    this.sellsign.sellerReloadpage();
  }

  calMinhight() {
    if(this.product.headerComHeight === -1) {
      return `calc(100vh - 120px - 2rem)`;
    }
    return `calc(100vh - ${this.product.headerComHeight}px)`;
  }

  login(data: Login) {
    if (data.email == '' || data.password == '') {
      this.SellerLoginfailed = "Fields are Empty.";
      setTimeout(() => this.SellerLoginfailed = undefined, 2000);
    }
    else {
      this.isLoader = true;
      this.sellsign.sellerLoginservice(data).subscribe((result: any) => {
        this.isLoader = false;
        if (result && result.body && result.body.length) {
          localStorage.setItem('seller', JSON.stringify(result.body));
          this.router.navigate(['seller-homepage']);
        }
        else {
          this.SellerLoginfailed = "Email or Passwrod is not correct";
          setTimeout(() => this.SellerLoginfailed = undefined, 2000);
        }
      },
        (error) => {
          this.isLoader = false;
          this.SellerLoginfailed = "Server is down please contact to Tarun";
          setTimeout(() => this.SellerLoginfailed = undefined, 2000);
        });
    }
  }
}
