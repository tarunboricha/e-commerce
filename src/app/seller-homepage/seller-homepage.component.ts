import { Component, OnInit } from '@angular/core';
import { ProductSerService } from '../services/product-ser.service';
import { product } from '../data-type';
import { Router } from '@angular/router';
import { faTrash,faEdit } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-seller-homepage',
  templateUrl: './seller-homepage.component.html',
  styleUrls: ['./seller-homepage.component.css'],
})
export class SellerHomepageComponent implements OnInit {

  flipHeading:boolean = false;
  productList: undefined | product[];
  deleteIcon = faTrash;
  updateIcon = faEdit;
  constructor(private product: ProductSerService, private router: Router) { }
  ngOnInit(): void {
    this.productlistfun();
  }

  Filterproduct(data: string) {
    if (data == 'All') {
      this.productlistfun();
    }
    else{
      this.product.FilterProductService(data).subscribe((result) => {
        this.productList = result;
      })
    }
  }
  deleteProduct(data: number) {
    this.product.deleteProductservice(data).subscribe((result) => {
      if (result) {
        this.productlistfun();
      }
    })
  }

  productlistfun() {
    this.product.productListservice().subscribe((result) => {
      console.log('HELLO' + result);
      this.productList = result;
    })
  }
}
