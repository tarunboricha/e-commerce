import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductSerService } from '../services/product-ser.service';
import { product } from '../data-type';
import { query } from '@angular/animations';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  serverError: boolean = false;
  isLoader: boolean = false;
  isDetailsLoad: boolean = false;
  searchProductData: undefined | product[];
  constructor(private router: ActivatedRoute, private product: ProductSerService) { }
  ngOnInit(): void {
    this.loadDetails();
  }

  loadDetails(): void {
    if (!this.isDetailsLoad) {
      this.isLoader = true;

      const query = this.router.snapshot.paramMap.get('query');
      const category = this.router.snapshot.paramMap.get('cat');

      if (query) {
        this.searchProduct(query);
      } else if (category) {
        this.filterProduct(category);
      }

      this.isDetailsLoad = true;
    }
  }

  searchProduct(query: string): void {
    this.product.searchProductService(query).subscribe(
      (result) => {
        this.searchProductData = result;
        this.isLoader = false;
      },
      (error) => {
        console.error('Error fetching search product data:', error);
        this.serverError = true;
        // Handle error as needed
      }
    );
  }

  filterProduct(category: string): void {
    this.product.FilterProductService(category).subscribe(
      (result) => {
        if (result) {
          this.isLoader = false;
          this.searchProductData = result;
        }
      },
      (error) => {
        console.error('Error fetching filtered product data:', error);
        this.serverError = true;
        // Handle error as needed
      }
    );
  }
}