import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { addToCart, product, userCartItem } from '../data-type';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  headerHeight: number = 0;
  isMobile: boolean = false;
  isLoader: boolean = false;
  isServerDown: EventEmitter<boolean> = new EventEmitter<boolean>();
  sellerProductSearch: EventEmitter<string> = new EventEmitter<string>();
  userCartData = new EventEmitter<userCartItem[]>();
  private baseUrl: string = "https://b337-103-250-162-216.ngrok-free.app";

  constructor(private http: HttpClient) { }

  getProductService(pId: number) {
    return this.http.get<product[]>(`${this.baseUrl}/products/${pId}`);
  }

  trendingProductservice() {
    return this.http.get<product[]>(`${this.baseUrl}/trending_products`);
  }

  similarProductservice(productType: string, id: number) {
    return this.http.get<product[]>(`${this.baseUrl}/similar_products/${productType}/${id}`);
  }

  addProductService(data: product) {
    return this.http.post(`${this.baseUrl}/products`, data);
  }

  updateProductService(product: product) {
    return this.http.put(`${this.baseUrl}/products/${product.id}`, product);
  }

  searchProductService(data: string, correc: boolean) {
    return this.http.get<{ correctedQuery: string, result: (product[]) }>(`${this.baseUrl}/search?query=${encodeURIComponent(data)}&correction=${encodeURIComponent(correc)}`);
  }

  productListservice() {
    return this.http.get<product[]>(`${this.baseUrl}/products`);
  }

  userRemoveToCartService(pID: number, uID: number) {
    return this.http.delete(`${this.baseUrl}/Cart/${pID}/${uID}`);
  }

  userAddToCartService(product: addToCart) {
    return this.http.post(`${this.baseUrl}/Cart`, product);
  }

  userAddToCarts(cartItems: addToCart[]) {
    return this.http.post(`${this.baseUrl}/Carts`, cartItems);
  }

  userSaveLaterService(pID: number, uID: number) {
    return this.http.put(`${this.baseUrl}/cart/savelater`, { pID: pID, userID: uID });
  }

  userMoveToCartService(pID: number, uID: number) {
    return this.http.put(`${this.baseUrl}/cart/movetocart`, { pID: pID, userID: uID });
  }

  getUserCartlist(userID: number) {
    this.isLoader = true;
    return this.http.get<userCartItem[]>(`${this.baseUrl}/Cart/${userID}`).
      subscribe({
        next: (result: userCartItem[]) => {
          this.isLoader = false;
          this.userCartData.emit(result);
        },
        error: (error) => {
          this.isLoader = false;
          this.isServerDown.emit(true);
          this.userCartData.emit([]);
        }
      });
  }

  localRemoveToCart(pID: number) {
    let userCartData = JSON.parse(localStorage.getItem('LocaladdToCart') || '[]');
    userCartData = userCartData.filter((item: product) => pID !== item.id);
    if (userCartData.length) {
      localStorage.setItem('LocaladdToCart', JSON.stringify(userCartData));
      this.userCartData.emit(userCartData);
    }
    else {
      localStorage.removeItem('LocaladdToCart');
      this.userCartData.emit([]);
    }
  }

  localAddToCart(cartItem: userCartItem) {
    let cartData: userCartItem[] = [];
    let localData = localStorage.getItem('LocaladdToCart');
    if (!localData)
      cartData.push(cartItem);
    else {
      cartData = JSON.parse(localData);
      const index = cartData.findIndex((item: { id: number; }) => item.id === cartItem.id);
      if (index !== -1) {
        cartData[index].savelater = false;
        cartData[index].productSize = cartItem.productSize;
      }
      else
        cartData.push(cartItem);
    }
    localStorage.setItem('LocaladdToCart', JSON.stringify(cartData));
    this.userCartData.emit(cartData);
  }

  localSaveLater(data: number) {
    let localData = localStorage.getItem('LocaladdToCart');
    let cartData: userCartItem[] = localData ? JSON.parse(localData) : [];
    cartData.forEach((item: userCartItem) => {
      if (item.id === data) {
        item.savelater = true;
      }
    });
    localStorage.setItem('LocaladdToCart', JSON.stringify(cartData));
    this.userCartData.emit(cartData);
  }

  localMoveToCart(pID: number) {
    let localData = localStorage.getItem('LocaladdToCart');
    let cartData: userCartItem[] = localData ? JSON.parse(localData) : [];
    cartData.forEach((item: userCartItem) => {
      if (item.id === pID) {
        item.savelater = false;
      }
    });
    localStorage.setItem('LocaladdToCart', JSON.stringify(cartData));
    this.userCartData.emit(cartData);
  }
}
