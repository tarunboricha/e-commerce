import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { addToCart, order, product } from '../data-type';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ProductSerService {

  constructor(private http: HttpClient, private router: Router) { }

  isMobile: boolean = false;
  isVisitor: boolean = false;
  headerComHeight: number = -1;
  wishlist: product[] = [];
  staticProducts: any[] = [
    {
      "productName": "DENNISLINGO",
      "productPrice": "900",
      "productType": "Shirt",
      "productColor": "Pink",
      "productDisc": "Dusty Pink, Full Sleeves Slim Fit Shirt Shirts perfect for Casual",
      "productURL": "https://assets.ajio.com/medias/sys_master/root/20221109/dFuy/636b8ea1f997ddfdbd663f06/-1117Wx1400H-462103975-pink-MODEL.jpg",
      "id": 1
    },
    {
      "productName": "ABSTRACT PRINT SHIRT",
      "productPrice": "3000",
      "productType": "Shirt",
      "productColor": "Black",
      "productDisc": "Relaxed fit shirt. Camp collar and short sleeves. Button-up front.",
      "productURL": "https://static.zara.net/photos///2023/V/0/2/p/4100/264/084/2/w/750/4100264084_2_1_1.jpg?ts=1669367920281",
      "id": 2
    },
    {
      "productName": "RIPPED SKINNY JEANS",
      "productPrice": "3999",
      "productType": "Jeans",
      "productColor": "Blue",
      "productDisc": "Skinny fit jeans. Five pockets. Faded and ripped effect on the legs. Front zip fly and button fastening.",
      "productURL": "https://static.zara.net/photos///2023/V/0/2/p/5585/306/401/2/w/750/5585306401_2_1_1.jpg?ts=1673370434932",
      "id": 3
    },
    {
      "productName": "DENNISLINGO",
      "productPrice": "30000",
      "productType": "Shirt",
      "productColor": "Blue",
      "productDisc": "Blue, Checked Slim Fit Shirt Shirts perfect for Casual",
      "productURL": "https://assets.ajio.com/medias/sys_master/root/20221109/xg7d/636b8e9af997ddfdbd663e62/-473Wx593H-461119105-blue-MODEL2.jpg",
      "id": 4
    },
    {
      "productName": "DENIM JEANS",
      "productPrice": "4000",
      "productType": "Jeans",
      "productColor": "Dark Blue",
      "productDisc": "Men Blue Tailored Tapered Fit Jeans",
      "productURL": "https://assets.myntassets.com/dpr_1.5,q_60,w_400,c_limit,fl_progressive/assets/images/20757328/2022/11/15/8276aa53-d89c-4583-a19d-0502776231dd1668507845819Trousers1.jpg",
      "id": 5
    },
    {
      "productName": "BLUE CASUAL SHIRT",
      "productPrice": "1200",
      "productType": "Shirt",
      "productColor": "Dark Blue",
      "productDisc": "Blue lining Shirt AllenSolly Casual",
      "productURL": "https://cdn.shopify.com/s/files/1/0584/2770/3448/products/5f3cb7bbb4681_1800x1800.jpg?v=1629355901",
      "id": 6
    },
    {
      "productName": "HEART PRINT T-SHIRT",
      "productPrice": "2300",
      "productType": "T-Shirt",
      "productDisc": "T-shirt with a round neckline and short sleeves. Contrast prints on the front and back with a velvet texture.",
      "productURL": "https://static.zara.net/photos///2023/V/0/2/p/0495/427/712/2/w/750/0495427712_2_1_1.jpg?ts=1674811204703",
      "id": 7
    },
    {
      "productName": "GRAPHIC T-SHIRT",
      "productPrice": "2290",
      "productType": "T-Shirt",
      "productDisc": "Stretch cotton T-shirt featuring a round neck, short sleeves and contrast prints on the front and back.",
      "productURL": "https://static.zara.net/photos///2023/V/0/2/p/6224/313/250/2/w/750/6224313250_2_1_1.jpg?ts=1677597823189",
      "id": 8
    }];

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YourAccessToken', // Add any other headers you need
    'ngrok-skip-browser-warning': 'your-custom-value'
  });
  isLoader: boolean = false;
  isServerDown: EventEmitter<boolean> = new EventEmitter<boolean>();
  cartData = new EventEmitter<product[]>();
  addProductMessage: string = '';

  AddProductservice(data: product) {
    return this.http.post('https://5565-103-250-162-216.ngrok-free.app/products', data, { headers: this.headers, observe: 'response' });
  }

  addTrendingproduct(data: number) {
    return this.http.put(`https://5565-103-250-162-216.ngrok-free.app/addtrendingProducts/${data}`, { headers: this.headers });
  }

  removeTrendingproduct(data: number) {
    return this.http.put(`https://5565-103-250-162-216.ngrok-free.app/removetrendingProducts/${data}`, { headers: this.headers });
  }

  productListservice() {
    return this.http.get<product[]>('https://5565-103-250-162-216.ngrok-free.app/products', { headers: this.headers });
  }

  deleteProductservice(data: number) {
    return this.http.delete(`https://5565-103-250-162-216.ngrok-free.app/products/${data}`, { headers: this.headers });
  }

  getProductservice(data: string) {
    return this.http.get<product[]>(`https://5565-103-250-162-216.ngrok-free.app/products/${data}`, { headers: this.headers });
  }

  updateProductservice(data: product) {
    return this.http.put(`https://5565-103-250-162-216.ngrok-free.app/products/${data.id}`, data, { headers: this.headers });
  }

  saveLater(data: number, userID: number) {
    return this.http.put(`https://5565-103-250-162-216.ngrok-free.app/cart/savelater`, { pID: data, userID: userID }, { headers: this.headers });
  }

  moveToCartService(data: number, userID: number) {
    return this.http.put(`https://5565-103-250-162-216.ngrok-free.app/cart/movetocart`, { pID: data, userID: userID }, { headers: this.headers });
  }

  popularProductservice() {
    return this.http.get<any>('https://5565-103-250-162-216.ngrok-free.app/popular_products', { headers: this.headers });
  }

  trendingProductservice() {
    return this.http.get<product[]>('https://5565-103-250-162-216.ngrok-free.app/trending_products', { headers: this.headers });
  }

  similarProductservice(productType: string, id: number) {
    return this.http.get<product[]>(`https://5565-103-250-162-216.ngrok-free.app/similar_products/${productType}/${id}`, { headers: this.headers });
  }

  searchSuggestionservice(data: string) {
    return this.http.get<product[]>(`https://5565-103-250-162-216.ngrok-free.app/products?q=${data}`, { headers: this.headers });
  }

  searchProductService(data: string, correc:boolean) {
    return this.http.get<product[]>(`https://5565-103-250-162-216.ngrok-free.app/search?query=${encodeURIComponent(data)}&correction=${encodeURIComponent(correc)}`, { headers: this.headers });
  }

  FilterProductService(data: string) {
    return this.http.get<product[]>(`https://5565-103-250-162-216.ngrok-free.app/products/productType/${data}`, { headers: this.headers });
  }

  localAddtoCartservice(data: any) {
    data.savelater = false;
    let cartData: product[] = [];
    let localData = localStorage.getItem('LocaladdToCart');
    if (!localData) {
      cartData.push(data)
      localStorage.setItem('LocaladdToCart', JSON.stringify(cartData));
      this.cartData.emit(cartData);
    }
    else {
      cartData = JSON.parse(localData);
      let flag = true;
      for(let i = 0; i<cartData.length; i++) {
        if(data.id === cartData[i].id) {
          flag = false;
          cartData[i].savelater = false;
          break;
        }
      }
      if(flag)
        cartData.push(data);
      localStorage.setItem('LocaladdToCart', JSON.stringify(cartData));
      this.cartData.emit(cartData);
    }
  }

  addToWishlist(product: product) {
    if (!this.isInWishlist(product.id)) {
      this.wishlist.push(product);
      product.wishlist = true;
    }
  }

  removeFromWishlist(productId: number) {
    const index = this.wishlist.findIndex(product => product.id === productId);
    if (index !== -1) {
      this.wishlist.splice(index, 1);
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlist.some(product => product.id === productId);
  }

  UseraddTocart(data: addToCart) {
    return this.http.post('https://5565-103-250-162-216.ngrok-free.app/Cart', data, { headers: this.headers });
  }

  UseraddTocarts(data: addToCart[]) {
    return this.http.post('https://5565-103-250-162-216.ngrok-free.app/Carts', data, { headers: this.headers });
  }

  userremoveTocart(data: number, userID: number) {
    return this.http.delete('https://5565-103-250-162-216.ngrok-free.app/Cart/' + data + '/' + userID, { headers: this.headers });
  }

  localremoveTocart(data: number) {
    let localData = localStorage.getItem('LocaladdToCart');
    let itemsData: product[] = localData && JSON.parse(localData);
    itemsData = itemsData.filter((item: product) => data !== item.id);
    if (itemsData.length) {
      localStorage.setItem('LocaladdToCart', JSON.stringify(itemsData));
      this.cartData.emit(itemsData);
    }
    else {
      localStorage.removeItem('LocaladdToCart');
      this.cartData.emit([]);
    }
  }

  localSaveLater(data: number) {
    let localData = localStorage.getItem('LocaladdToCart');
    let itemsData: product[] = localData && JSON.parse(localData);
    itemsData.forEach((item: any) => {
      if (item.id === data) {
        item.savelater = true;
      }
    });
    localStorage.setItem('LocaladdToCart', JSON.stringify(itemsData));
    this.cartData.emit(itemsData);
  }

  localMoveToCart(data: number) {
    let localData = localStorage.getItem('LocaladdToCart');
    let itemsData: product[] = localData && JSON.parse(localData);
    itemsData.forEach((item: any) => {
      if (item.id === data) {
        item.savelater = false;
      }
    });
    localStorage.setItem('LocaladdToCart', JSON.stringify(itemsData));
    this.cartData.emit(itemsData);
  }

  getCartlist(data: number, fun: string) {
    console.log('getCartlist called with function: ', fun);
    this.isLoader = true;
    return this.http.get<product[]>(`https://5565-103-250-162-216.ngrok-free.app/Cart/${data}`,
      { headers: this.headers, observe: 'response' }).subscribe((result) => {
        this.isLoader = false;
        if (result && result.body) {
          this.cartData.emit(result.body);
        }
      }, (error) => {
        this.isServerDown.emit(true);
        this.isLoader = false;
        console.log(error);
        this.cartData.emit([]);
        // this.router.navigate(['']);
      });
  }

  orderNow(data: order) {
    return this.http.post('http://localhost:3000/orders', data);
  }

  cancelOrder(orderId: number) {
    return this.http.delete('http://localhost:3000/orders/' + orderId)
  }

  deleteCartItems(cartId: number) {
    return this.http.delete('http://localhost:3000/Cart/' + cartId).subscribe((result) => {
      this.cartData.emit([]);
    })
  }

  orderList() {
    let userStore = localStorage.getItem('4uUser');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<order[]>('http://localhost:3000/orders?userId=' + userData.id);
  }
}
