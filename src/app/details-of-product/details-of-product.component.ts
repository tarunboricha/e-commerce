import { Component, OnInit } from '@angular/core';
import { ProductSerService } from '../services/product-ser.service';
import { ActivatedRoute, Router } from '@angular/router';
import { addToCart, product } from '../data-type';
import { Subscription } from 'rxjs';

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
  userCartSubscription: Subscription | undefined;
  routeSubscription: Subscription | undefined;
  userCartDetail: product[] | undefined;

  constructor(private productService: ProductSerService, private route: ActivatedRoute, private router: Router) { }

  // ngOnInit(): void {
  //   this.userCartSubscription = this.productService.cartData.subscribe((result) => {
  //     this.userCartDetail = result;
  //   });
  //   this.routeSubscription = this.route.paramMap.subscribe(params => {
      
  //   });
  // }

  async ngOnInit(): Promise<void> {
    this.isLoader1 = true;
    await new Promise<void>((resolve) => {
      this.userCartSubscription = this.productService.cartData.subscribe((result) => {
        this.userCartDetail = result;
        resolve();
      });
    });
  
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const id = params.get('Productid');
      if (!id) return;
      this.isLoader1 = true;
      this.productService.getProductservice(id).subscribe(
        (result: any) => {
          this.detailsOfProduct = result[0];
          this.loadSimilarProducts();
          this.isLoader1 = false;
          let product = this.userCartDetail?.filter(product => {
            return this.detailsOfProduct?.id === product.id;
          });
          if (product?.length) {
            this.removeCard = true;
            if (product[0].productQuantity)
              this.productQuantity = product[0].productQuantity;
            if (product[0].productSize)
              this.selectedSize = 'Size: ' + product[0].productSize.toString();
          }
          else {
            this.removeCard = false;
            this.productQuantity = 1;
            this.selectedSize = 'Select Size';
            this.productSize = undefined;
          }
        },
        (error: any) => {
          this.isLoader1 = false;
          this.detailsOfProduct = this.productService.staticProducts[parseInt(id, 10) - 1];
          this.loadSimilarProducts();
          this.productService.isServerDown.emit(true);
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
      if (userID && this.detailsOfProduct) {
        this.productService.userremoveTocart(this.detailsOfProduct.id, userID).subscribe(
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

  ngOnDestroy(): void {
    this.userCartSubscription?.unsubscribe();
    this.routeSubscription?.unsubscribe();
  }
}
