import { Component, OnInit } from '@angular/core';
import { ProductSerService } from '../services/product-ser.service';
import { product } from '../data-type';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  staticProducts:any[] = [{
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
  }]
  isLoader: boolean = true;
  popularProducts:product[] = [];
  trendingProducts:product[] = [];
  serverError: boolean = false;
  constructor(private product:ProductSerService){}
  ngOnInit(): void {
    const popularProduct$ = this.product.popularProductservice();
    const trendingProduct$ = this.product.trendingProductservice();
  
    forkJoin([popularProduct$, trendingProduct$]).subscribe(
      ([popularProducts, trendingProducts]) => {
        this.popularProducts = popularProducts;
        this.trendingProducts = trendingProducts;
        this.isLoader = false;
      },
      (error) => {
        // Handle errors if needed
        console.error('Error fetching data:', error);
        this.isLoader = false;
        // this.serverError = true;
        this.popularProducts = this.staticProducts.slice(0, 3);
        this.trendingProducts = this.staticProducts;
      }
    );
  }
}
