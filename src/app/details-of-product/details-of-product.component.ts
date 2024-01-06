import { Component, OnInit } from '@angular/core';
import { ProductSerService } from '../services/product-ser.service';
import { ActivatedRoute } from '@angular/router';
import { addToCart, product } from '../data-type';

@Component({
  selector: 'app-details-of-product',
  templateUrl: './details-of-product.component.html',
  styleUrls: ['./details-of-product.component.css']
})
export class DetailsOfProductComponent implements OnInit {

  isLoader: boolean = false;
  isLoader1: boolean = false;
  Selectsize: string = 'Select Size';
  productSize: number | undefined;
  removeCard: boolean = false;
  productQuantity: number = 1;
  detailsOfproduct: undefined | product;
  cartDetails: product | undefined;
  constructor(private product: ProductSerService, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.isLoader1 = true;
    let id = this.route.snapshot.paramMap.get('Productid');
    id && this.product.getProductservice(id).subscribe((result) => {
      this.isLoader1 = false;
      console.log('PRODUCT DETAILS: ' + result);
      this.detailsOfproduct = result[0];
    });
    if (localStorage.getItem('user')) {
      this.product.cartData.subscribe((result) => {
        if (result) {
          result = result.filter((item: product) => id == item.productID?.toString());
          if (result.length) {
            this.cartDetails = result[0];
            this.removeCard = true;
            if (result[0].productQuantity)
              this.productQuantity = result[0].productQuantity;
            if (result[0].productSize)
              this.Selectsize = 'Size: ' + result[0].productSize.toString();
          }
        }
      });
    }
    else {
      let cartData = localStorage.getItem('LocaladdToCart');
      if (id && cartData?.length) {
        let itemData = JSON.parse(cartData);
        itemData = itemData.filter((item: product) => id == item.id.toString());
        if (itemData.length != 0) {
          this.removeCard = true;
          this.productQuantity = itemData[0].productQuantity;
          this.Selectsize = itemData[0].productSize;
        }
        else {
          this.removeCard = false;
        }
      }
    }
  }
  size(data: number) {
    this.productSize = data;
    this.Selectsize = 'Size: ' + data.toString();
  }
  AddtoCartProduct() {
    if (this.Selectsize == 'Select Size') {
      alert('Please Select Size');
      return;
    }
    if (this.detailsOfproduct) {
      let userData = localStorage.getItem('user');
      if (userData) {
        this.isLoader = true;
        let userID = JSON.parse(userData)[0].userID;
        let Cartdata: addToCart = {
          userID,
          productID: this.detailsOfproduct.id,
          productSize: this.productSize,
          productQuantity: this.productQuantity
        }
        console.log(Cartdata);
        this.product.UseraddTocart(Cartdata).subscribe((result) => {
          if (result) {
            this.product.getCartlist(userID);
            this.removeCard = true;
            this.isLoader = false;
          }
        });
      }
      else {
        this.detailsOfproduct.productQuantity = this.productQuantity
        this.detailsOfproduct.productSize = this.productSize;
        this.product.localAddtoCartservice(this.detailsOfproduct);
        this.removeCard = true;
      }
    }
  }
  RemovetoCartProduct(data: number) {
    if (!localStorage.getItem('user')) {
      this.product.localremoveTocart(data);
    }
    else {
      this.isLoader = true;
      let user = localStorage.getItem('user');
      let userID = user && JSON.parse(user)[0].userID;
      this.cartDetails && this.product.userremoveTocart(this.cartDetails.id, userID).subscribe((result) => {
        if (result) {
          this.product.getCartlist(userID);
          this.removeCard = false;
          this.productQuantity = 1;
          this.Selectsize = 'Select Size';
          this.isLoader = false;
        }
      });
    }
  }

  handleQuantity(data: string) {
    if (data == 'plus' && this.productQuantity < 20)
      this.productQuantity++;
    else if (data == 'min' && this.productQuantity > 1)
      this.productQuantity--;
  }
}
