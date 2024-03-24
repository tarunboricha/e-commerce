import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User, addToCart, userCartItem } from '../data-type';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

  userAuthFailedMessage: string | undefined;
  userAuthSucessMessage: string | undefined;
  isSignIn: boolean = true;
  signupForm!: FormGroup;
  isLoader: boolean = false;

  constructor(private authService: AuthService, private router: Router, private productService: ProductService) { }

  ngOnInit(): void {
    if (localStorage.getItem('4uUser'))
      this.router.navigate(['']);
    this.signupForm = new FormGroup({
      firstname: new FormControl<string>('', [Validators.required]),
      lastname: new FormControl<string>('', []),
      email: new FormControl<string>('', [Validators.required, Validators.email]),
      password: new FormControl<string>('', [Validators.required, Validators.minLength(6)])
    });
  }

  markAllUnTouched() {
    this.signupForm.reset();
    Object.values(this.signupForm.controls).forEach(control => {
      control.markAsUntouched();
    });
  }

  onUserSignIn(credentials: { email: string, password: string }) {
    this.authService.userSignIn(credentials.email, credentials.password).subscribe({
      next: (result: User[]) => {
        if (result && result.length) {
          localStorage.setItem('4uUser', JSON.stringify(result));
          this.router.navigate(['']);
          this.localCarttoUserCart();
        }
        else {
          this.authService.authFailedMessage.emit("Email or Password is not correct.");
        }
      },
      error: (error) => {
        console.log(error);
        this.authService.authFailedMessage.emit("Server is down please try again later.");
      }
    });
  }

  onUserSignUp() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      this.signupForm.get('lastname')?.markAsUntouched();
      return;
    }
    const user: User = {
      firstname: this.signupForm.get('firstname')?.value,
      lastname: this.signupForm.get('lastname')?.value,
      email: this.signupForm.get('email')?.value,
      password: this.signupForm.get('password')?.value
    }
    console.log(user);
    this.isLoader = true;
    this.authService.userSignUp(user).subscribe({
      next: (result) => {
        this.signupForm.reset();
        this.isLoader = false;
        this.userAuthSucessMessage = "Sign up sucessfully!!..";
        setTimeout(() => {
          this.isSignIn = true;
          this.userAuthSucessMessage = undefined;
        }, 1500);
      },
      error: (error) => {
        this.authService.authFailedMessage.emit("Server is down please try again later.");
      }
    });
  }

  localCarttoUserCart() {
    let Data = localStorage.getItem('LocaladdToCart');
    localStorage.removeItem('LocaladdToCart');
    let CartData: userCartItem[] = Data && JSON.parse(Data);
    let userData = localStorage.getItem('4uUser');
    let uID = userData && JSON.parse(userData)[0].userID;
    if (CartData && uID) {
      let data: addToCart[] = [];
      CartData.forEach((product: userCartItem, index) => {
        let temp: addToCart = {
          productID: product.id,
          productQuantity: product.productQuantity,
          productSize: product.productSize,
          userID: uID,
          savelater: product.savelater
        };
        console.log(uID);
        data.push(temp);
      });
      console.log(data);
      this.productService.userAddToCarts(data).subscribe((result) => {
        this.productService.getUserCartlist(uID);
      });
    }
  }

  calMinhight() {
    return `calc(100vh - ${this.productService.headerHeight}px - 1rem)`;
  }
}
