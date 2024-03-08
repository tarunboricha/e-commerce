import { Component, OnInit } from '@angular/core';
import { ProductSerService } from '../services/product-ser.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  similarProducts: product[] | undefined;
  cartDetails: product | undefined;
  constructor(protected product: ProductSerService, private route: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.isLoader1 = true;
      let id = params.get('Productid');
      id && this.product.getProductservice(id).subscribe((result) => {
        this.isLoader1 = false;
        console.log('PRODUCT DETAILS: ' + result);
        this.detailsOfproduct = result[0];
        this.product.similarProductservice(this.detailsOfproduct.productType, this.detailsOfproduct.id).subscribe((result) => {
          this.similarProducts = result;
        },
          (error) => {
            console.log(error);
          });
      }, (error) => {
        // this.router.navigate(['']);
        this.isLoader1 = false;
        if (id) {
          this.detailsOfproduct = this.product.staticProducts[parseInt(id, 10) - 1];
        }
      });
      if (localStorage.getItem('4uUser')) {
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
    });
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
      let userData = localStorage.getItem('4uUser');
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
            this.product.getCartlist(userID, 'AddtoCart');
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
    if (!localStorage.getItem('4uUser')) {
      this.product.localremoveTocart(data);
      this.removeCard = false;
      this.productQuantity = 1;
      this.Selectsize = 'Select Size';
    }
    else {
      this.isLoader = true;
      let user = localStorage.getItem('4uUser');
      let userID = user && JSON.parse(user)[0].userID;
      this.cartDetails && this.product.userremoveTocart(this.cartDetails.id, userID).subscribe((result) => {
        if (result) {
          this.product.getCartlist(userID, 'RemovefromCart');
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
