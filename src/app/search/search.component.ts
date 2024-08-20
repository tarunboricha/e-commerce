import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {

  isEmpty: boolean = false;
  isLoader: boolean = false;
  loaderfilteredProducts: boolean[] = [false, false, false, false, false, false, false, false];
  filteredProducts: any;
  searchProductData: product[] = [];
  categories = new Set<string>;
  colors = new Set<string>;
  selectedCategory: string = '';
  selectedColor: string = '';
  minPrice: number = 0;
  maxPrice: number = 0;
  originalQuery: string = '';
  correctedQuery: string = '';
  showFilter: boolean = false;
  isQuery: boolean = false;

  constructor(private route: ActivatedRoute, protected productService: ProductService, private http: HttpClient, private router:Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const query = params['que'];
      const correc = params['correc'];
      const category = params['cat'];
      this.clearFilters();
      this.categories.clear();
      this.colors.clear();
      if (query) {
        this.isQuery = true;
        this.loaderfilteredProducts = [false, false];
        this.searchProduct(query, correc);
      }
      else
        this.searchProduct(category, false);
    });
  }

  searchProduct(query: string, correc: boolean) {
    this.isLoader = true;
    this.productService.searchProductService(query, correc).subscribe({
      next: (result: { correctedQuery: string, result: (product[]) }) => {
        this.originalQuery = query;
        if (this.originalQuery.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '') === result.correctedQuery.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, ''))
          this.correctedQuery = this.originalQuery;
        else
          this.correctedQuery = result.correctedQuery;
        this.isLoader = false;
        if (result.result.length) {
          this.isEmpty = false;
          this.searchProductData = result.result;
          this.applyFilters();
        }
        else {
          this.searchProductData = [];
          this.filteredProducts = [];
          this.isEmpty = true;
        }
      },
      error: (error) => {
        this.productService.isServerDown.emit(true);
        if (!this.isQuery) {
          this.http.get<product[]>('https://tarunboricha.github.io/e-commerce/assets/data/product-data.json')
            .subscribe((products: product[]) => {
              this.isLoader = false;
              this.searchProductData = products.filter(product => {
                return product.productType === query;
              });
              this.applyFilters();
            });
        }
        else
          this.router.navigate(['']);
      }
    });
  }

  applyFilters() {
    this.filteredProducts = this.searchProductData.filter(product => {
      this.categories.add(product.productType);
      this.colors.add(product.productColor);
      let passCategory = !this.selectedCategory || product.productType === this.selectedCategory;
      let passPrice = (!this.minPrice || product.productPrice >= this.minPrice) &&
        (!this.maxPrice || product.productPrice <= this.maxPrice);
      let passColor = !this.selectedColor || product.productColor === this.selectedColor;
      return passCategory && passPrice && passColor;
    });
  }

  clearFilters() {
    this.filteredProducts = this.searchProductData;
    this.selectedCategory = '';
    this.selectedColor = '';
    this.minPrice = 0;
    this.maxPrice = 0;
  }

  calMinhight() {
    return `calc(100vh - ${this.productService.headerHeight}px)`;
  }

  calMinHightProduct() {
    return `calc(100vh - ${this.productService.headerHeight}px - 2rem)`;
  }

  calFilterContainerTop() {
    return `calc(${this.productService.headerHeight}px + 1rem)`;
  }

  toggleFilter() {
    this.showFilter ? document.body.classList.remove('disable-scroll') : document.body.classList.add('disable-scroll');
    this.showFilter = !this.showFilter;
  }
}