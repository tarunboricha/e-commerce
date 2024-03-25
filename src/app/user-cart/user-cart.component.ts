import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { priceSummary, product, userCartItem } from '../data-type';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-cart',
  templateUrl: './user-cart.component.html',
  styleUrl: './user-cart.component.css'
})
export class UserCartComponent implements OnInit {

  userCartItems: userCartItem[] = [];
  saveLaterItems: userCartItem[] = [];
  isLoader: boolean = false;
  isCartEmpty: boolean = false;
  userCartSubcription: Subscription | undefined;
  priceSummary: priceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0
  };

  constructor(protected productService: ProductService) { }

  ngOnInit(): void {
    this.subscribeToUserCartData();
  }

  private subscribeToUserCartData(): void {
    this.userCartSubcription = this.productService.userCartData.subscribe((userCartData: userCartItem[]) => {
      if (userCartData && userCartData.length) {
        this.userCartItems = userCartData.filter(item => !item.savelater);
        this.saveLaterItems = userCartData.filter(item => item.savelater);
        let price = 0;
        this.userCartItems.forEach(item => {
          if (item.productQuantity)
            price += item.productPrice * item.productQuantity;
        });
        this.priceSummary.price = price;
        this.priceSummary.tax = this.priceSummary.discount = Math.floor(price / 10);
        this.priceSummary.delivery = price ? 100 : 0;
        this.priceSummary.total = price + this.priceSummary.delivery;
        this.userCartItems.length ? this.isCartEmpty = false : this.isCartEmpty = true;
      } else {
        this.isCartEmpty = true;
        this.userCartItems = [];
        this.saveLaterItems = [];
        this.priceSummary.price = 0;
        this.priceSummary.discount = 0;
        this.priceSummary.tax = 0;
        this.priceSummary.delivery = 0;
        this.priceSummary.total = 0;
      }
    });
  }

  calMinhight() {
    return this.productService.isMobile ? `calc(100vh - ${this.productService.headerHeight}px - ${this.productService.headerHeight}px - 3rem)` : `calc(100vh - ${this.productService.headerHeight}px - 2rem)`;
  }

  priceSummaryTopValue() {
    return `calc(${this.productService.headerHeight}px + 1rem)`;
  }

  removeToCart(product: userCartItem) {
    if (product.userID) {
      product.isloaderRemoveCart = true;
      this.isLoader = true;
      this.productService.userRemoveToCartService(product.id, product.userID).subscribe({
        next: (result) => {
          this.isLoader = false;
          this.productService.getUserCartlist(product.userID ? product.userID : 0);
        },
        error: (error) => {
          this.productService.isServerDown.emit(true);
        }
      });
    } else {
      this.productService.localRemoveToCart(product.id);
    }
  }

  moveToCart(product: userCartItem) {
    if (product.userID) {
      product.isloaderSaveLater = true;
      this.isLoader = true;
      this.productService.userMoveToCartService(product.id, product.userID).subscribe({
        next: (result) => {
          this.isLoader = false;
          this.productService.getUserCartlist(product.userID ? product.userID : 0);
        },
        error: (error) => {
          this.productService.isServerDown.emit(true);
        }
      });
    }
    else {
      this.productService.localMoveToCart(product.id);
    }
  }

  saveLater(product: userCartItem) {
    if (product.userID) {
      product.isloaderSaveLater = true;
      this.isLoader = true;
      this.productService.userSaveLaterService(product.id, product.userID).subscribe({
        next: (result) => {
          this.isLoader = false;
          this.productService.getUserCartlist(product.userID ? product.userID : 0);
        },
        error: (error) => {
          this.productService.isServerDown.emit(true);
        }
      });
    }
    else {
      this.productService.localSaveLater(product.id);
    }
  }

  increaseQuantity(product: userCartItem) {
    if (product.productQuantity)
      product.productQuantity++;
  }

  decreaseQuantity(product: userCartItem) {
    if (product.productQuantity)
      product.productQuantity > 1 ? product.productQuantity-- : product.productQuantity = 1;
  }

  ngOnDestroy(): void {
    this.userCartSubcription?.unsubscribe();
  }
}
