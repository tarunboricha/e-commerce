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

  productData: undefined | product;
  constructor(private router: ActivatedRoute, private product: ProductSerService, private route: Router) { }
  ngOnInit(): void {
    let productId = this.router.snapshot.paramMap.get('id');
    productId && this.product.getProductservice(productId).subscribe((result) => {
      this.productData = result[0];
    });
  }
  UpdateproductMessage: string | undefined;

  updateProduct(data: product) {
    console.log(data);
    if (this.productData) {
      data.id = this.productData.id;
    }
    this.product.updateProductservice(data).subscribe((result) => {
      console.log("result");
      if (result) {
        this.UpdateproductMessage = 'Product is Successfully Updated!';
      }
      setTimeout(() => this.UpdateproductMessage = undefined, 2000);
      setTimeout(() => this.route.navigate(['/seller-homepage']), 2000);
    });
  }
}
