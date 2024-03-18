import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { priceSummary } from '../data-type';
import { ProductSerService } from '../services/product-ser.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.css']
})
export class AddToCartComponent implements OnInit, OnDestroy {

  numberofSaveLater:number = 0;
  numberOfCartItem:number = 0;
  subscription: Subscription | undefined;
  CartDetails: undefined | any;
  userID: number | undefined;
  priceSummary: priceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0
  }
  isCartempty: boolean = false;
  cartItems:any = [];
  saveLaterItem:any = [];
  isLoader:boolean = false;

  constructor(protected product: ProductSerService, private router: Router) { }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.product.cartData.subscribe((result) => {
      if (result.length) {
        this.numberOfCartItem = result.length;
        this.CartDetails = result;
        this.cartItems = [];
        this.saveLaterItem = [];
        this.userID = this.CartDetails[0].userID;
        let price = 0;
        if (this.CartDetails.length) {
          this.CartDetails.forEach((item: any) => {
            item.isloaderRemoveCart = false;
            item.isloaderSaveLater = false;
            if (item.productQuantity && !item.savelater) {
              price = price + (+item.productPrice * +item.productQuantity)
            }
            if(!item.savelater) {
              this.cartItems.push(item);
            }
            else {
              this.saveLaterItem.push(item);
            }
          });

          this.priceSummary.price = price;
          this.priceSummary.discount = price / 10;
          this.priceSummary.discount = Math.floor(this.priceSummary.discount);
          this.priceSummary.tax = price / 10;
          this.priceSummary.tax = Math.floor(this.priceSummary.tax);
          this.priceSummary.delivery = 100;
          this.priceSummary.total = price + 100;
          if(!this.cartItems.length) {
            this.isCartempty = true;
            this.priceSummary.delivery = 0;
            this.priceSummary.total = 0;
          }
          else {
            this.isCartempty = false;
          }
        }
      }
      else {
        this.cartItems = [];
        this.saveLaterItem = [];
        this.isCartempty = true;
        this.CartDetails = undefined;
        this.priceSummary.price = 0;
        this.priceSummary.discount = 0;
        this.priceSummary.tax = 0;
        this.priceSummary.delivery = 0;
        this.priceSummary.total = 0;
      }
    });
  }

  saveLater(item:any) {
    console.log(item);
    if (localStorage.getItem('4uUser')) {
      item.isloaderSaveLater = true;
      this.isLoader = true;
      this.product.saveLater(item.id, this.userID? this.userID : 0).subscribe((result) => {
        if (result) {
          this.isLoader = false;
          this.product.getCartlist(this.userID? this.userID : 0, 'RemovetoCart');
        }
      });
    }
    else {
      this.product.localSaveLater(item.id);
    }
  }

  moveToCart(item:any) {
    if (localStorage.getItem('4uUser')) {
      item.isloaderSaveLater = true;
      this.isLoader = true;
      this.product.moveToCartService(item.id, this.userID? this.userID : 0).subscribe((result) => {
        if (result) {
          this.isLoader = false;
          this.product.getCartlist(this.userID? this.userID : 0, 'RemovetoCart');
        }
      });
    }
    else {
      this.product.localMoveToCart(item.id);
    }
  }

  calMinhight() {
    if(this.product.isMobile) {
      return `calc(100vh - ${this.product.headerComHeight}px - ${this.product.headerComHeight}px)`;
    }
    return `calc(100vh - ${this.product.headerComHeight}px - 2rem)`;
  }

  priceSummaryTopValue() {
    return `calc(${this.product.headerComHeight}px + 1rem)`;
  }

  calMinhightofCarts() {
    if(this.product.isMobile) {
      return `calc(100vh - ${this.product.headerComHeight}px - ${this.product.headerComHeight}px - 3.4rem)`;
    }
    return `calc(100vh - ${this.product.headerComHeight}px - 2rem)`;
  }

  RemovetoCart(item:any) {
    if (localStorage.getItem('4uUser')) {
      item.isloaderRemoveCart = true;
      this.isLoader = true;
      this.product.userremoveTocart(item.id, item.userID).subscribe((result) => {
        if (result) {
          this.isLoader = false;
          this.product.getCartlist(item.userID, 'RemovetoCart');
        }
      });
    }
    else {
      this.product.localremoveTocart(item.id);
    }
  }

  increaseQuantity(item: any): void {
    item.productQuantity++;
  }

  decreaseQuantity(item: any): void {
    if (item.productQuantity > 1) {
      item.productQuantity--;
    }
  }
}