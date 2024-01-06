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
    this.user.UserLoginservice(data).subscribe((result: any) => {
      console.log(result);
      if (result && result.body && result.body.length) {
        localStorage.setItem('user', JSON.stringify(result.body));
        this.router.navigate(['']);
        this.localCarttoUserCart();
      }
      else {
        this.LoginFailedmessage = "Email or Password is not Correct";
        setTimeout(() => this.LoginFailedmessage = undefined, 2000);
      }
    });
  }

  localCarttoUserCart() {
    let Data = localStorage.getItem('LocaladdToCart');
    localStorage.removeItem('LocaladdToCart');
    let CartData: product[] = Data && JSON.parse(Data);
    let userData = localStorage.getItem('user');
    let uID = userData && JSON.parse(userData)[0].userID;
    if (CartData.length && uID) {
      let data: addToCart[] = [];
      CartData.forEach((product: product, index) => {
        let temp: addToCart = {
          productID: product.id,
          productQuantity: product.productQuantity,
          productSize: product.productSize,
          userID: uID
        };
        console.log(uID);
        data.push(temp);
      });
      this.product.UseraddTocarts(data).subscribe((result) => {
        this.product.getCartlist(uID);
      });
    }
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
