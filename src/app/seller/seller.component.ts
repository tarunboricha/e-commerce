import { Component, OnInit } from '@angular/core';
import { SellerSerService } from '../services/seller-ser.service';
import { Login } from '../data-type';
import { Router } from '@angular/router';
import { ProductSerService } from '../services/product-ser.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.css']
})
export class SellerComponent implements OnInit {

  isLoader: boolean = false;
  SellerLoginfailed: undefined | string;
  constructor(private sellsign: SellerSerService, private router: Router, private product: ProductSerService) { }
  ngOnInit(): void {
    this.sellsign.sellerReloadpage();
  }

  calMinhight() {
    return `calc(100vh - ${this.product.headerComHeight}px)`;
  }

  login(form: NgForm) {
    if (form.valid) {
      this.isLoader = true;
      this.sellsign.sellerLoginservice(form.value).subscribe((result: any) => {
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
    else {
      this.markAllControlsAsTouched(form);
    }
  }

  markAllControlsAsTouched(form: NgForm) {
    Object.keys(form.controls).forEach(controlName => {
      const control = form.controls[controlName];
      control.markAsTouched();
    });
  }
}
