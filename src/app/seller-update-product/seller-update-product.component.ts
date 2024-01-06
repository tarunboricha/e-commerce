import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductSerService } from '../services/product-ser.service';
import { product } from '../data-type';

@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrls: ['./seller-update-product.component.css']
})
export class SellerUpdateProductComponent implements OnInit {

  isLoader1: boolean = false;
  isLoader: boolean = false;
  productData: undefined | product;
  constructor(private router: ActivatedRoute, private product: ProductSerService, private route: Router) { }
  ngOnInit(): void {
    this.isLoader1 = true;
    let productId = this.router.snapshot.paramMap.get('id');
    productId && this.product.getProductservice(productId).subscribe((result) => {
      this.isLoader1 = false;
      this.productData = result[0];
    });
  }
  UpdateproductMessage: string | undefined;

  updateProduct(data: product) {
    this.isLoader = true;
    console.log(data);
    if (this.productData) {
      data.id = this.productData.id;
    }
    this.product.updateProductservice(data).subscribe((result) => {
      console.log("result");
      if (result) {
        document.querySelectorAll('form')[0].reset(); 
        this.isLoader = false;
        this.UpdateproductMessage = 'Product is Successfully Updated!';
        setTimeout(() => this.UpdateproductMessage = undefined, 1000);
        setTimeout(() => this.route.navigate(['/seller-homepage']), 1000);
      }
    });
  }
}
