import { Component, OnInit } from '@angular/core';
import { ProductSerService } from '../services/product-ser.service';
import { product } from '../data-type';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  loaders: number[] = [1, 2, 3, 4]
  isLoader: boolean = true;
  popularProducts: product[] = [];
  trendingProducts: product[] = [];
  serverError: boolean = false;
  constructor(protected product: ProductSerService) { }
  ngOnInit(): void {
    this.product.trendingProductservice().subscribe((result) => {
      this.trendingProducts = result;
      this.isLoader = false;
      if (!this.product.isVisitor) {
        this.product.popularProductservice().subscribe((result) => {
          this.product.isVisitor = true;
        });
      }
    },
      (error: any) => {
        // Handle errors if needed
        console.error('Error fetching data:', error);
        this.isLoader = false;
        // this.serverError = true;
        this.popularProducts = this.product.staticProducts.slice(0, 3);
        this.trendingProducts = this.product.staticProducts;
      });
  }
}
