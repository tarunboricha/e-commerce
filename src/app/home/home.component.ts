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

  isLoader: boolean = true;
  popularProducts:product[] = [];
  trendingProducts:product[] = [];
  serverError: boolean = false;
  constructor(private product:ProductSerService){}
  ngOnInit(): void {
    const popularProduct$ = this.product.popularProductservice();
    const trendingProduct$ = this.product.trendingProductservice();
  
    forkJoin([popularProduct$, trendingProduct$]).subscribe(
      ([popularProducts, trendingProducts]) => {
        this.popularProducts = popularProducts;
        this.trendingProducts = trendingProducts;
        this.isLoader = false;
      },
      (error) => {
        // Handle errors if needed
        console.error('Error fetching data:', error);
        this.isLoader = false;
        // this.serverError = true;
        this.popularProducts = this.product.staticProducts.slice(0, 3);
        this.trendingProducts = this.product.staticProducts;
      }
    );
  }
}
