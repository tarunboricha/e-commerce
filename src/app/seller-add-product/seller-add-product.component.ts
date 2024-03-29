import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrl: './seller-add-product.component.css'
})
export class SellerAddProductComponent implements OnInit {

  isLoader: boolean = false;

  constructor(private productService: ProductService, private authService: AuthService, private router:Router) { }

  ngOnInit(): void {
    
  }

  addProduct(product: product) {
    this.productService.addProductService(product).subscribe({
      next: (result) => {
        this.authService.authSucessMessage.emit("Product is sucessfully added");
        setTimeout(() => {
          this.router.navigate(['seller-dashboard']);
        }, 1500);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  calMinhight() {
    return `calc(100vh - ${this.productService.headerHeight}px - 2rem)`;
  }

}
