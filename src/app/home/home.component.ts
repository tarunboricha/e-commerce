import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  loaders: number[] = [1, 2, 3, 4, 5, 6]
  isLoader: boolean = false;
  trendingProducts: product[] = [];
  serverError: boolean = false;
  carouselImages: string[] = ["https://raw.githubusercontent.com/lassiecoder/E-CommerceWebsite/ce9366326d7b7991d1f898cfb1b7fa386923ae0a/img/img2.png", "https://raw.githubusercontent.com/lassiecoder/E-CommerceWebsite/ce9366326d7b7991d1f898cfb1b7fa386923ae0a/img/img4.png", "https://raw.githubusercontent.com/lassiecoder/E-CommerceWebsite/ce9366326d7b7991d1f898cfb1b7fa386923ae0a/img/img1.png"];

  constructor(private productService: ProductService, private http: HttpClient) { }

  ngOnInit(): void {
    this.isLoader = true;
    this.productService.trendingProductservice().subscribe({
      next: (products) => {
        this.trendingProducts = products;
        this.isLoader = false;
      },
      error: (error) => {
        this.http.get<product[]>('https://tarunboricha.github.io/e-commerce/assets/data/product-data.json').subscribe((products: product[]) => {
          this.trendingProducts = products.slice(0, 6);
          this.isLoader = false;
          this.productService.isServerDown.emit(true);
        });
      }
    });
  }
}
