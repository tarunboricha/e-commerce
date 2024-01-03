import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { addToCart, order, product } from '../data-type';
@Injectable({
  providedIn: 'root'
})
export class ProductSerService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YourAccessToken', // Add any other headers you need
    'ngrok-skip-browser-warning': 'your-custom-value'
  });
  cartData = new EventEmitter<product[] | []>();
  addProductMessage: string = '';
  constructor(private http: HttpClient) { }
  AddProductservice(data: product) {
    return this.http.post('https://84e3-103-250-162-221.ngrok-free.app/products', data, { headers: this.headers,observe: 'response' });
  }

  productListservice() {
    return this.http.get<product[]>('https://84e3-103-250-162-221.ngrok-free.app/products', {headers: this.headers});
  }

  deleteProductservice(data: number) {
    return this.http.delete(`https://84e3-103-250-162-221.ngrok-free.app/products/${data}`,{headers: this.headers});
  }

  getProductservice(data: string) {
    return this.http.get<product[]>(`https://84e3-103-250-162-221.ngrok-free.app/products/${data}`,{headers: this.headers});
  }

  updateProductservice(data: product) {
    return this.http.put(`https://84e3-103-250-162-221.ngrok-free.app/products/${data.id}`, data, {headers: this.headers});
  }

  popularProductservice() {
    return this.http.get<product[]>('https://84e3-103-250-162-221.ngrok-free.app/popular_products', {headers: this.headers});
  }

  trendingProductservice() {
    return this.http.get<product[]>('https://84e3-103-250-162-221.ngrok-free.app/trending_products', {headers: this.headers});
  }

  searchSuggestionservice(data: string) {
    return this.http.get<product[]>(`https://84e3-103-250-162-221.ngrok-free.app/products?q=${data}`, {headers: this.headers});
  }

  searchProductService(data: string) {
    return this.http.get<product[]>(`https://84e3-103-250-162-221.ngrok-free.app/products?q=${data}`, {headers: this.headers});
  }

  FilterProductService(data: string) {
    return this.http.get<product[]>(`https://84e3-103-250-162-221.ngrok-free.app/products/productType/${data}`, {headers: this.headers});
  }

  localAddtoCartservice(data: product) {
    let cartData = [];
    let localData = localStorage.getItem('LocaladdToCart');
    if (!localData) {
      localStorage.setItem('LocaladdToCart', JSON.stringify([data]));
      this.cartData.emit([data]);
    }
    else {
      cartData = JSON.parse(localData);
      cartData.push(data);
      localStorage.setItem('LocaladdToCart', JSON.stringify(cartData));
      this.cartData.emit(cartData);
    }
  }

  UseraddTocart(data: addToCart) {
    return this.http.post('https://84e3-103-250-162-221.ngrok-free.app/Cart', data, {headers: this.headers});
  }

  removeTocart(data: number) {
    let user = localStorage.getItem('user');
    let userID = user && JSON.parse(user)[0].userID;
    if (localStorage.getItem('user')) {
      this.http.delete('https://84e3-103-250-162-221.ngrok-free.app/Cart/' + data + '/' + userID, {headers: this.headers}).subscribe((result) => {
        if (result) {
          this.getCartlist(userID);
        }
      });
    }
    else {
      let localData = localStorage.getItem('LocaladdToCart');
      let itemsData: product[] = localData && JSON.parse(localData);
      itemsData = itemsData.filter((item: product) => data !== item.id);
      if (itemsData.length) {
        localStorage.setItem('LocaladdToCart', JSON.stringify(itemsData));
        this.cartData.emit(itemsData);
      }
      else{
        localStorage.removeItem('LocaladdToCart');
        this.cartData.emit([]);
      }
    }
  }

  getCartlist(data: number) {
    console.log("Tarun" + data);
    return this.http.get<product[]>(`https://84e3-103-250-162-221.ngrok-free.app/Cart/${data}`,
      { headers: this.headers,observe: 'response' }).subscribe((result) => {
        if (result && result.body) {
          this.cartData.emit(result.body);
        }
      });
  }
  orderNow(data: order) {
    return this.http.post('http://localhost:3000/orders', data);
  }
  cancelOrder(orderId:number){
    return this.http.delete('http://localhost:3000/orders/'+orderId)
  }
  deleteCartItems(cartId: number) {
    return this.http.delete('http://localhost:3000/Cart/' + cartId).subscribe((result) => {
      this.cartData.emit([]);
    })
  }
  orderList() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<order[]>('http://localhost:3000/orders?userId=' + userData.id);
  }
}
