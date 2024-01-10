import { Component, OnInit } from '@angular/core';
import { priceSummary, product } from '../data-type';
import { ProductSerService } from '../services/product-ser.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.css']
})
export class AddToCartComponent implements OnInit {
  
  isLoader: boolean = false;
  CartDetails: undefined | any;
  userID: number | undefined;
  priceSummary: priceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0
  }
  constructor(protected product: ProductSerService, private router: Router) { }
  tempFun() {
    if (localStorage.getItem('4uUser')) {
      this.product.cartData.subscribe((result) => {
        if (result.length) {
          this.CartDetails = result;
          let price = 0;
          if (this.CartDetails.length) {
            this.CartDetails.forEach((item:any) => {
              if (item.productQuantity) {
                price = price + (+item.productPrice * +item.productQuantity)
              }
              item.isloader = false;
            })
            this.priceSummary.price = price;
            this.priceSummary.discount = price / 10;
            this.priceSummary.discount = Math.floor(this.priceSummary.discount);
            this.priceSummary.tax = price / 10;
            this.priceSummary.tax = Math.floor(this.priceSummary.tax);
            this.priceSummary.delivery = 100;
            this.priceSummary.total = price + 100;
          }
        }
        else {
          this.CartDetails = undefined;
          this.priceSummary.price = 0;
          this.priceSummary.discount = 0;
          this.priceSummary.tax = 0;
          this.priceSummary.delivery = 0;
          this.priceSummary.total = 0;
        }
      });
    }
    else{
      this.router.navigate(['/user']);
    }
  }
  ngOnInit(): void {
    this.tempFun();
  }
  RemovetoCart(data: number, index:number) {
    this.isLoader = true;
    this.CartDetails[index].isloader = true;
    let user = localStorage.getItem('4uUser');
    let userID = user && JSON.parse(user)[0].userID;
    this.product.userremoveTocart(data, userID).subscribe((result) => {
      if (result) {
        this.product.getCartlist(userID, 'RemovetoCart');
        setTimeout(() => {
          this.isLoader = false;
        }, 100);
      }
    });
    this.tempFun();
  }
}