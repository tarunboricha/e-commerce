import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';
import { Seller } from '../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrl: './seller.component.css'
})
export class SellerComponent implements OnInit {

  constructor(private authService: AuthService, private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem('seller'))
      this.router.navigate(['seller-dashboard']);
  }

  onSellerSignIn(credentials: { email: string, password: string }): void {
    this.authService.sellerSignIn(credentials.email, credentials.password).subscribe({
      next: (sellerDetail: Seller[]) => {
        if (sellerDetail && sellerDetail.length) {
          localStorage.setItem('seller', JSON.stringify(sellerDetail[0]));
          this.router.navigate(['seller-dashboard']);
        }
        else
          this.authService.authFailedMessage.emit("Email or Passwrod is not correct");
      },
      error: (error) => {
        console.log(error);
        this.authService.authFailedMessage.emit("Server is down please try again later.");
      }
    });
  }

  calMinhight() {
    return `calc(100vh - ${this.productService.headerHeight}px - 1rem)`;
  }
}
