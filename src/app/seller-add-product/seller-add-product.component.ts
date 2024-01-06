import { Component } from '@angular/core';
import { ProductSerService } from '../services/product-ser.service';
import { product } from '../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css']
})
export class SellerAddProductComponent {

  isLoader:boolean = false;
  data:string = 'Product Category';
  AddproductMessage:string|undefined;
  constructor(private product:ProductSerService, private route: Router){}
  fun(){
    this.data = '';
  }
  addProduct(data:product){
    this.isLoader = true;
    data.id = 0;
    console.log(data);
    this.product.AddProductservice(data).subscribe((result)=>{
      if(result){
        this.isLoader = false;
        this.AddproductMessage = "Product is Successfully Added!";
        setTimeout(()=>this.AddproductMessage = undefined, 1000);
        setTimeout(() => this.route.navigate(['/seller-homepage']), 1000);
      }
    });
  }
}
