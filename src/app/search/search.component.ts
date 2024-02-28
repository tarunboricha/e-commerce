import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductSerService } from '../services/product-ser.service';
import { product } from '../data-type';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  isLoader: boolean = false;
  isDetailsLoad: boolean = false;
  searchProductData: product[] = [];
  constructor(private router: ActivatedRoute, private product: ProductSerService, private rout:Router) { }
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
        // this.rout.navigate(['']);
        // Handle error as needed
        this.isLoader = false;
        let size = this.product.staticProducts.length;
        if(query == 'Shirt') {
          for(let i = 0; i<size; i++) {
            if(this.product.staticProducts[i].productType == 'Shirt') {
              this.searchProductData.push(this.product.staticProducts[i]);
            }
          }
        }
        else if (query == 'T-Shirt'){
          for(let i = 0; i<size; i++) {
            if(this.product.staticProducts[i].productType == 'T-Shirt') {
              this.searchProductData.push(this.product.staticProducts[i]);
            }
          }
        }
        else if (query == 'Jeans'){
          for(let i = 0; i<size; i++) {
            if(this.product.staticProducts[i].productType == 'Jeans') {
              this.searchProductData.push(this.product.staticProducts[i]);
            }
          }
        }
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
        // this.rout.navigate(['']);
        // Handle error as needed
        this.isLoader = false;
        let size = this.product.staticProducts.length;
        if(category == 'Shirt') {
          for(let i = 0; i<size; i++) {
            if(this.product.staticProducts[i].productType == 'Shirt') {
              this.searchProductData.push(this.product.staticProducts[i]);
            }
          }
        }
        else if (category == 'T-Shirt'){
          for(let i = 0; i<size; i++) {
            if(this.product.staticProducts[i].productType == 'T-Shirt') {
              this.searchProductData.push(this.product.staticProducts[i]);
            }
          }
        }
        else if (category == 'Jeans'){
          for(let i = 0; i<size; i++) {
            if(this.product.staticProducts[i].productType == 'Jeans') {
              this.searchProductData.push(this.product.staticProducts[i]);
            }
          }
        }
      }
    );
  }
}