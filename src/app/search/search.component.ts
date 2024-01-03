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

  isDetailsLoad: boolean = false;
  searchProductData: undefined | product[];
  constructor(private router: ActivatedRoute, private product: ProductSerService) { }
  ngOnInit(): void {
    this.loadDetails();
  }
  loadDetails() {
    if (!this.isDetailsLoad) {
      let Query = this.router.snapshot.paramMap.get('query');
      if (Query) {
        Query && this.product.searchProductService(Query).subscribe((result) => {
          this.searchProductData = result;
        });
        this.isDetailsLoad = true;
      }
      else {
        let Category = this.router.snapshot.paramMap.get('cat');
        Category && this.product.FilterProductService(Category).subscribe((result) => {
          if (result) {
            this.searchProductData = result;
          }
        });
        this.isDetailsLoad = true;
      }
    }
  }
}