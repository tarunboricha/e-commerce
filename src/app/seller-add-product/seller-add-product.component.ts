import { Component } from '@angular/core';
import { ProductSerService } from '../services/product-ser.service';
import { product } from '../data-type';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css']
})
export class SellerAddProductComponent {

  data:string = 'Product Category';
  AddproductMessage:string|undefined;
  constructor(private product:ProductSerService){}
  fun(){
    this.data = '';
  }
  addProduct(data:product){
    data.id = 0;
    console.log(data);
    this.product.AddProductservice(data).subscribe((result)=>{
      if(result){
        this.AddproductMessage = "Product is Successfully Added!";
      }
      
      setTimeout(()=>this.AddproductMessage = undefined, 3000);
    });
  }
}
