import { Component, OnInit, PipeTransform } from '@angular/core';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-dashboard',
  templateUrl: './seller-dashboard.component.html',
  styleUrl: './seller-dashboard.component.css'
})
export class SellerDashboardComponent implements OnInit {

  isLoader: boolean = false;
  filter = new FormControl('', { nonNullable: true });
  allProducts: product[] = [];
  filterProducts: product[] = [];
  sellerSearchSubcription!: Subscription;

  constructor(private productService: ProductService, private router: Router) {
  }

  ngOnInit(): void {
  if (!localStorage.getItem('seller'))
      this.router.navigate(['']);
    this.sellerSearchSubcription = this.productService.sellerProductSearch.subscribe((query) => {
      this.search(query);
    });
    this.isLoader = true;
    this.productService.productListservice().subscribe({
      next: (products) => {
        this.isLoader = false;
        this.allProducts = products;
        this.filterProducts = this.allProducts;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }


  search(text: string) {
    if (text === '') {
      this.filterProducts = this.allProducts;
      return;
    }
    const terms = text.split(' ');
    this.filterProducts = this.allProducts.filter((product) => {
      return terms.every(term =>
        product.productName.toLowerCase().includes(term) ||
        product.productType.toLowerCase() === term ||
        product.productColor.toLowerCase().includes(term)
      );
    });
  }

  deleteProduct(pID: number) {

  }

  trendingProduct() {

  }

  calMinhight() {
    return `calc(100vh - ${this.productService.headerHeight}px - 2rem)`;
  }

  ngOnDestroy(): void {
    this.sellerSearchSubcription.unsubscribe();
  }
}