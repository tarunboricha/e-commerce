import { Component, OnInit } from '@angular/core';
import { Login, addToCart, product, signUp } from '../data-type';
import { UserSerService } from '../services/user-ser.service';
import { Router } from '@angular/router';
import { ProductSerService } from '../services/product-ser.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  productid: number[] | undefined;
  LoginFailedmessage: undefined | string;
  constructor(private user: UserSerService, private router: Router, private product: ProductSerService) { }
  ngOnInit(): void {
    if (localStorage.getItem('user')) {
      this.router.navigate(['']);
    }
  }
  showSignUp: boolean = false;
  signUp(data: signUp) {
    this.user.userSignupservice(data);
  }

  Login(data: Login) {
    this.user.UserLoginservice(data);
    this.user.UserLoginFailed.subscribe((result) => {
      if (result) {
        this.LoginFailedmessage = "Email or Password is not Correct";
        setTimeout(() => this.LoginFailedmessage = undefined, 2000);
      }
    });
    setTimeout(() => {
      this.localCarttoUserCart();
    }, 300);
  }

  localCarttoUserCart() {
    let Data = localStorage.getItem('LocaladdToCart');
    localStorage.removeItem('LocaladdToCart');
    let CartData: product[] = Data && JSON.parse(Data);
    let userData = localStorage.getItem('user');
    let userID = userData && JSON.parse(userData)[0].userID;
    if (CartData.length) {
      this.product.getCartlist(userID);
      this.product.cartData.subscribe((result) => {
        const alreadyAdded = new Set(result.map(e => e.productID));
        CartData = CartData.filter((item: product) => !alreadyAdded.has(item.id));
        CartData.forEach((product: product, index) => {
          let Cart: addToCart = {
            ...product,
            productID: product.id,
            userID,
            productSize:product.productSize
          };
          this.product.UseraddTocart(Cart).subscribe((result) => { });
        });
      });
    }
    setTimeout(() => {
      this.product.getCartlist(userID);
    }, 1000);
  }

  flipPage() {
    if (this.showSignUp) {
      this.showSignUp = false;
    }
    else {
      this.showSignUp = true;
    }
  }
}
