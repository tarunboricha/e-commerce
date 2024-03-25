import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { addToCart, product, userCartItem } from '../data-type';
import { Subscription } from 'rxjs';
import { ProductService } from '../services/product.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})

export class ProductDetailComponent implements OnInit {

  isLoader: boolean = false;
  btnLoader: boolean = false;
  selectedSize: string = 'Select Size';
  productSize: number | undefined;
  isRemoveCard: boolean = false;
  productQuantity: number = 1;
  detailsOfProduct!: product;
  similarProducts: product[] | undefined;
  userCartSubscription: Subscription | undefined;
  routeSubscription: Subscription | undefined;
  userCartDetail: userCartItem[] = [];
  userID: number | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private productService: ProductService, private http: HttpClient) { }

  ngOnInit(): void {
    const userCartPromise = new Promise<void>((resolve) => {
      this.userCartSubscription = this.productService.userCartData.subscribe((products: userCartItem[]) => {
        this.userCartDetail = products;
        if (products.length && products[0].userID)
          this.userID = products[0].userID;
        resolve();
      });
    });

    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const id = params.get('pID');
      if (!id) return;
      this.isLoader = true;
      this.productService.getProductService(parseInt(id)).subscribe({
        next: (product) => {
          this.detailsOfProduct = product[0];
          this.getSimilarProducts();
          this.isLoader = false;
          userCartPromise.then((result) => {
            let { isRemoveCard, productQuantity, selectedSize } = this.processUserCart(this.userCartDetail, this.detailsOfProduct);
            this.isRemoveCard = isRemoveCard;
            this.productQuantity = productQuantity;
            this.selectedSize = selectedSize;
          });
        },
        error: (error) => {
          this.productService.isServerDown.emit(true);
          this.http.get<product[]>('https://tarunboricha.github.io/e-commerce/assets/data/product-data.json').subscribe((shirts: product[]) => {
            this.isLoader = false;
            this.detailsOfProduct = shirts.filter((item) => parseInt(id) === item.id)[0];
            userCartPromise.then((result) => {
              let { isRemoveCard, productQuantity, selectedSize } = this.processUserCart(this.userCartDetail, this.detailsOfProduct);
              this.isRemoveCard = isRemoveCard;
              this.productQuantity = productQuantity;
              this.selectedSize = selectedSize;
            });
          });
        }
      });
    });
  }

  getSimilarProducts() {
    if (this.detailsOfProduct) {
      this.productService.similarProductservice(this.detailsOfProduct.productType, this.detailsOfProduct.id).subscribe({
        next: (similarProducts) => {
          this.similarProducts = similarProducts;
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  addToCart() {
    if (this.selectedSize === 'Select Size') {
      alert("Please select the size.");
      return;
    }
    const userData = JSON.parse(localStorage.getItem('4uUser') || '[]')[0];
    if (userData?.userID) {
      this.btnLoader = true;
      const addToCartItem: addToCart = {
        userID: userData.userID,
        productID: this.detailsOfProduct.id,
        productSize: this.productSize,
        productQuantity: this.productQuantity,
        savelater: false
      };
      this.productService.userAddToCartService(addToCartItem).subscribe({
        next: (result) => {
          this.productService.getUserCartlist(userData.userID).add(() => {
            this.btnLoader = false;
            this.isRemoveCard = true;
            setTimeout(() => {
              this.router.navigate(['viewcart']);
            }, 500);
          });
        },
        error: (error) => {
          this.productService.isServerDown.emit(true);
          this.btnLoader = false;
        }
      });
    }
    else {
      const addToCartItem: userCartItem = {
        ...this.detailsOfProduct,
        productID: this.detailsOfProduct.id,
        productSize: this.productSize ? this.productSize : 0,
        wishlist: false,
        savelater: false,
        isloaderRemoveCart: false,
        isloaderSaveLater: false,
        userID: this.userID,
        productQuantity: this.productQuantity,
      };
      this.productService.localAddToCart(addToCartItem);
      this.isRemoveCard = true;
      setTimeout(() => {
        this.router.navigate(['viewcart']);
      }, 500);
    }
  }

  removeToCart(pID: number) {
    if (this.userID) {
      this.btnLoader = true;
      this.productService.userRemoveToCartService(pID, this.userID).subscribe({
        next: (result) => {
          this.productService.getUserCartlist(this.userID ? this.userID : 0).add(() => {
            this.btnLoader = false;
            this.isRemoveCard = false;
            this.selectedSize = 'Select Size';
            this.productSize = undefined;
          });
        },
        error: (error) => {
          this.productService.isServerDown.emit(true);
          this.btnLoader = false;
        }
      });
    }
    else {
      this.productService.localRemoveToCart(pID);
      this.isRemoveCard = false;
      this.selectedSize = 'Select Size';
      this.productSize = undefined;
    }
  }

  processUserCart(userCartDetail: userCartItem[], detailsOfProduct: product) {
    let product = userCartDetail?.find(product => detailsOfProduct?.id === product.id);

    if (product && !product.savelater) {
      return {
        isRemoveCard: true,
        productQuantity: product.productQuantity || 1,
        selectedSize: product.productSize ? 'Size: ' + product.productSize.toString() : 'Select Size'
      };
    } else {
      return {
        isRemoveCard: false,
        productQuantity: 1,
        selectedSize: 'Select Size',
        productSize: undefined
      };
    }
  }

  size(data: number) {
    this.productSize = data;
    this.selectedSize = 'Size: ' + data.toString();
  }
}