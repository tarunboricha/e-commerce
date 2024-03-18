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

  loaderfilteredProducts: boolean[] = [false, false, false, false, false, false, false, false]
  isLoader: boolean = false;
  showFilter: boolean = false;
  isDetailsLoad: boolean = false;
  filteredProducts: any[] = [];
  searchProductData: any[] = [];
  selectedCategory: string = '';
  minPrice: number = 0;
  maxPrice: number = 0;
  selectedRatings: string = '';
  selectedColor: string = '';
  categories = new Set<string>; // Example categories
  colors = new Set<string>; // Example colors
  correctedQuery: string = '';
  originalQuery: string = '';
  isEmpty: boolean = false;

  constructor(private route: ActivatedRoute, private router: ActivatedRoute, protected product: ProductSerService, private rout: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.isEmpty = false;
      let query = params['que'];
      let correc = params['correc'];
      let category = params['cat'];
      this.clearFilters();
      this.categories.clear();
      this.colors.clear();
      this.isLoader = true;
      if (query) {
        this.loaderfilteredProducts = [false, false];
        this.searchProduct(query, correc);
      }
      else {
        this.filterProduct(category);
      }
    });
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  clearFilters() {
    this.filteredProducts = this.searchProductData;
    this.selectedCategory = '';
    this.selectedColor = '';
    this.minPrice = 0;
    this.maxPrice = 0;
  }

  calMinhight() {
    return `calc(100vh - ${this.product.headerComHeight}px - 4rem)`;
  }

  calFilterContainerTop() {
    return `calc(${this.product.headerComHeight}px + 1rem)`;
  }

  searchProduct(query: string, correc: boolean): void {
    console.log("product is searched with", query);
    this.product.searchProductService(query, correc).subscribe(
      (result: any) => {
        this.originalQuery = query;
        this.correctedQuery = result.correctedQuery;
        this.isLoader = false;
        if (result.result.length) {
          this.searchProductData = result.result;
          console.log(result);
          this.applyFilters();
        }
        else {
          this.searchProductData = [];
          this.filteredProducts = [];
          this.isEmpty = true;
        }
      },
      (error) => {
        console.error('Error fetching search product data:', error);
        this.rout.navigate(['']);
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
          this.applyFilters();
        }
      },
      (error) => {
        console.error('Error fetching filtered product data:', error);
        // this.rout.navigate(['']);
        // Handle error as needed
        this.isLoader = false;
        let size = this.product.staticProducts.length;
        if (category == 'shirt') {
          for (let i = 0; i < size; i++) {
            if (this.product.staticProducts[i].productType == 'Shirt') {
              this.searchProductData.push(this.product.staticProducts[i]);
            }
          }
        }
        else if (category == 'tshirt') {
          for (let i = 0; i < size; i++) {
            if (this.product.staticProducts[i].productType == 'T-Shirt') {
              this.searchProductData.push(this.product.staticProducts[i]);
            }
          }
        }
        else if (category == 'jeans') {
          for (let i = 0; i < size; i++) {
            if (this.product.staticProducts[i].productType == 'Jeans') {
              this.searchProductData.push(this.product.staticProducts[i]);
            }
          }
        }
        this.applyFilters();
      }
    );
  }

  applyFilters() {
    this.filteredProducts = this.searchProductData.filter(product => {
      this.categories.add(product.productType);
      this.colors.add(product.productColor);
      let passCategory = !this.selectedCategory || product.productType === this.selectedCategory;
      let passPrice = (!this.minPrice || product.productPrice >= this.minPrice) &&
        (!this.maxPrice || product.productPrice <= this.maxPrice);
      // let passRatings = !this.selectedRatings || product.productRatings === parseInt(this.selectedRatings);
      let passColor = !this.selectedColor || product.productColor === this.selectedColor;
      return passCategory && passPrice && passColor;
    });
    // console.log(this.searchProductData);
  }
}