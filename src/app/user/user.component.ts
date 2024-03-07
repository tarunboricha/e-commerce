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

  isLoader: boolean = false;
  productid: number[] | undefined;
  LoginFailedmessage: undefined | string;
  constructor(private user: UserSerService, private router: Router, private product: ProductSerService) { }
  ngOnInit(): void {
    if (localStorage.getItem('4uUser')) {
      this.router.navigate(['']);
    }
  }
  showSignUp: boolean = false;
  signUp(data: signUp) {
    this.isLoader = true;
    data.userID = 0;
    if (data.name != '' && data.email != '' && data.password != '') {
      this.user.userSignupservice(data).subscribe((result) => {
        this.router.navigate(['']);
      },
      (error) => {
        this.isLoader = false;
        if (error.error.code === 'ER_DUP_ENTRY') {
          this.LoginFailedmessage = "Email is already registered";
          setTimeout(() => this.LoginFailedmessage = undefined, 2000);
        }
        else {
          this.LoginFailedmessage = "Server is down please contact to Tarun";
          setTimeout(() => this.LoginFailedmessage = undefined, 2000);
        }
      });
    }
  }

  Login(data: Login) {
    this.isLoader = true;
    this.user.UserLoginservice(data).subscribe((result: any) => {
      console.log(result);
      if (result && result.body && result.body.length) {
        localStorage.setItem('4uUser', JSON.stringify(result.body));
        this.router.navigate(['']);
        this.localCarttoUserCart();
        this.isLoader = false;
      }
      else {
        this.LoginFailedmessage = "Email or Password is not Correct";
        this.isLoader = false;
        setTimeout(() => this.LoginFailedmessage = undefined, 2000);
      }
    },
    (error) => {
      this.isLoader = false;
      this.LoginFailedmessage = "Server is down please contact to Tarun";
      setTimeout(() => this.LoginFailedmessage = undefined, 2000);
    });
  }

  localCarttoUserCart() {
    let Data = localStorage.getItem('LocaladdToCart');
    localStorage.removeItem('LocaladdToCart');
    let CartData: product[] = Data && JSON.parse(Data);
    let userData = localStorage.getItem('4uUser');
    let uID = userData && JSON.parse(userData)[0].userID;
    if (CartData && uID) {
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
        this.product.getCartlist(uID, 'localCarttoUserCart');
      });
    }
  }

  calMinhight() {
    if(this.product.headerComHeight === -1) {
      return `calc(100vh - 120px - 2rem)`;
    }
    return `calc(100vh - ${this.product.headerComHeight}px)`;
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
