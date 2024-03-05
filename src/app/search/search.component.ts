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

  loaderfilteredProducts = [1, 2]
  isLoader: boolean = false;
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

  constructor(private router: ActivatedRoute, protected product: ProductSerService, private rout: Router) { }

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
    console.log("product is searched with", query);
    this.product.searchProductService(query).subscribe(
      (result) => {
        this.searchProductData = result;
        this.isLoader = false;
        this.applyFilters();
        console.log(this.selectedCategory);
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