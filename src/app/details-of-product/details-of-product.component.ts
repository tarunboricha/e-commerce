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
        (result: any) => {
          this.isLoader1 = false;
          this.detailsOfProduct = result[0];
          this.loadSimilarProducts();
        },
        (error: any) => {
          this.isLoader1 = false;
          this.detailsOfProduct = this.productService.staticProducts[parseInt(id, 10) - 1];
          this.loadSimilarProducts();
          this.productService.isServerDown.emit(true);
        }
      );
      if (localStorage.getItem('4uUser')) {
        this.productService.cartData.subscribe((result) => {
          if (result) {
            result = result.filter((item: product) => id == item.productID?.toString());
            if (result.length) {
              this.cartDetails = result[0];
              this.removeCard = true;
              if (result[0].productQuantity)
                this.productQuantity = result[0].productQuantity;
              if (result[0].productSize)
                this.selectedSize = 'Size: ' + result[0].productSize.toString();
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
            this.selectedSize = 'Size: ' + itemData[0].productSize;
          }
          else {
            this.removeCard = false;
          }
        }
      }
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

  toggleWishlist(product: product) {
    if (product.wishlist) {
      this.productService.removeFromWishlist(product.id);
    } else {
      this.productService.addToWishlist(product);
    }
  }

  handleQuantity(action: string) {
    if (action === 'plus' && this.productQuantity < 20)
      this.productQuantity++;
    else if (action === 'min' && this.productQuantity > 1)
      this.productQuantity--;
  }
}
