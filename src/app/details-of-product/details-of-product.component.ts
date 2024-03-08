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
  selectedSize: string = 'Select Size';
  productSize: number | undefined;
  removeCard: boolean = false;
  productQuantity: number = 1;
  detailsOfProduct: product | undefined;
  similarProducts: product[] | undefined;
  cartDetails: product | undefined;

  constructor(private productService: ProductSerService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.isLoader1 = true;
      const id = params.get('Productid');
      if (!id) return;

      this.productService.getProductservice(id).subscribe(
        (result:any) => {
          this.isLoader1 = false;
          this.detailsOfProduct = result[0];
          this.loadSimilarProducts();
          this.loadCartDetails(id);
        },
        (error:any) => {
          this.isLoader1 = false;
          this.detailsOfProduct = this.productService.staticProducts[parseInt(id, 10) - 1];
          this.loadSimilarProducts();
        }
      );
    });
  }

  loadSimilarProducts() {
    if (this.detailsOfProduct) {
      this.productService.similarProductservice(this.detailsOfProduct.productType, this.detailsOfProduct.id).subscribe(
        (result) => {
          this.similarProducts = result;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  loadCartDetails(id: string) {
    if (localStorage.getItem('4uUser')) {
      this.productService.cartData.subscribe((result) => {
        if (result) {
          this.cartDetails = result.find((item: product) => id === item.productID?.toString());
          if (this.cartDetails) {
            this.removeCard = true;
            this.productQuantity = this.cartDetails.productQuantity || 1;
            this.selectedSize = 'Size: ' + (this.cartDetails.productSize || 'Select Size').toString();
          }
        }
      });
    } else {
      const cartData = localStorage.getItem('LocaladdToCart');
      if (id && cartData) {
        const itemData = JSON.parse(cartData);
        const item = itemData.find((item: product) => id === item.id.toString());
        if (item) {
          this.removeCard = true;
          this.productQuantity = item.productQuantity || 1;
          this.selectedSize = item.productSize || 'Select Size';
        }
      }
    }
  }

  size(data: number) {
    this.productSize = data;
    this.selectedSize = 'Size: ' + data.toString();
  }

  addToCartProduct() {
    if (this.selectedSize === 'Select Size') {
      alert('Please Select Size');
      return;
    }
    if (this.detailsOfProduct) {
      const userData = localStorage.getItem('4uUser');
      if (userData) {
        this.isLoader = true;
        const userID = JSON.parse(userData)[0].userID;
        const cartData: addToCart = {
          userID,
          productID: this.detailsOfProduct.id,
          productSize: this.productSize,
          productQuantity: this.productQuantity
        };
        this.productService.UseraddTocart(cartData).subscribe(
          (result) => {
            if (result) {
              this.productService.getCartlist(userID, 'AddtoCart');
              this.removeCard = true;
              this.isLoader = false;
            }
          }
        );
      } else {
        this.detailsOfProduct.productQuantity = this.productQuantity;
        this.detailsOfProduct.productSize = this.productSize;
        this.productService.localAddtoCartservice(this.detailsOfProduct);
        this.removeCard = true;
      }
    }
  }

  removeCartProduct(data: number) {
    if (!localStorage.getItem('4uUser')) {
      this.productService.localremoveTocart(data);
      this.removeCard = false;
      this.productQuantity = 1;
      this.selectedSize = 'Select Size';
    } else {
      this.isLoader = true;
      const user = localStorage.getItem('4uUser');
      const userID = user && JSON.parse(user)[0].userID;
      if (userID && this.cartDetails) {
        this.productService.userremoveTocart(this.cartDetails.id, userID).subscribe(
          (result) => {
            if (result) {
              this.productService.getCartlist(userID, 'RemovefromCart');
              this.removeCard = false;
              this.productQuantity = 1;
              this.selectedSize = 'Select Size';
              this.isLoader = false;
            }
          }
        );
      }
    }
  }

  handleQuantity(action: string) {
    if (action === 'plus' && this.productQuantity < 20)
      this.productQuantity++;
    else if (action === 'min' && this.productQuantity > 1)
      this.productQuantity--;
  }
}
