import { Component, OnInit } from '@angular/core';
import { ProductSerService } from '../services/product-ser.service';
import { product } from '../data-type';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  
  popularProducts:product[] = [];
  trendingProducts:product[] = [];
  constructor(private product:ProductSerService){}
  ngOnInit(): void {
    this.product.popularProductservice().subscribe((result)=>{
      this.popularProducts = result;
    });
    this.product.trendingProductservice().subscribe((result)=>{
      this.trendingProducts = result;
    })
  }
}
