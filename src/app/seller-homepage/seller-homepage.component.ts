import { Component, OnInit } from '@angular/core';
import { ProductSerService } from '../services/product-ser.service';
import { product } from '../data-type';
import { Router } from '@angular/router';
import { SellerSerService } from '../services/seller-ser.service';

@Component({
  selector: 'app-seller-homepage',
  templateUrl: './seller-homepage.component.html',
  styleUrls: ['./seller-homepage.component.css'],
})
export class SellerHomepageComponent implements OnInit {

  productType: string = 'All';
  isLoader: boolean = false;
  productList: undefined | product[];

  constructor(private product: ProductSerService, private router: Router, protected seller:SellerSerService) { }
  
  ngOnInit(): void {
    console.log('sellerhomepageoninitCalled');
    this.productlistfun();
  }

  Filterproduct(data: string) {
    if(data == this.productType)
      return;
    this.productType = data;
    if (data == 'All') {
      this.productlistfun();
    }
    else {
      data = data.toLowerCase().replace(/\W/g, '');
      this.isLoader = true;
      this.product.FilterProductService(data).subscribe((result) => {
        this.productList = result;
        this.isLoader = false;
      })
    }
  }
  deleteProduct(data: number) {
    this.isLoader = true;
    this.product.deleteProductservice(data).subscribe((result) => {
      if (result) {
        this.isLoader = false;
        this.productlistfun();
      }
    })
  }

  productlistfun() {
    this.isLoader = true;
    this.product.productListservice().subscribe((result) => {
      console.log('HELLO' + result);
      this.isLoader = false;
      this.productList = result;
    },
      (error) => {
        console.error('Error fetching search product data:', error);
        this.seller.serverError = true;
        // Handle error as needed
      }
    );
  }
}
