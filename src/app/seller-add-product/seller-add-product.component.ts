import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrl: './seller-add-product.component.css'
})
export class SellerAddProductComponent implements OnInit {

  isLoader: boolean = false;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    
  }

  addProduct(product: any) {
    console.log(product);
  }

  calMinhight() {
    return `calc(100vh - ${this.productService.headerHeight}px - 2rem)`;
  }

}
