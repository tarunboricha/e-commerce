import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductSerService } from '../services/product-ser.service';
import { product } from '../data-type';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  staticShirt:any[] = [{
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
    "productName": "DENNISLINGO",
    "productPrice": "30000",
    "productType": "Shirt",
    "productColor": "Blue",
    "productDisc": "Blue, Checked Slim Fit Shirt Shirts perfect for Casual",
    "productURL": "https://assets.ajio.com/medias/sys_master/root/20221109/xg7d/636b8e9af997ddfdbd663e62/-473Wx593H-461119105-blue-MODEL2.jpg",
    "id": 4
  }];
  staticTshirt:any[] = [{
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
  staticJeans:any[] =  [
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
      "productName": "DENIM JEANS",
      "productPrice": "4000",
      "productType": "Jeans",
      "productColor": "Dark Blue",
      "productDisc": "Men Blue Tailored Tapered Fit Jeans",
      "productURL": "https://assets.myntassets.com/dpr_1.5,q_60,w_400,c_limit,fl_progressive/assets/images/20757328/2022/11/15/8276aa53-d89c-4583-a19d-0502776231dd1668507845819Trousers1.jpg",
      "id": 5
    }
  ];
  isLoader: boolean = false;
  isDetailsLoad: boolean = false;
  searchProductData: undefined | product[];
  constructor(private router: ActivatedRoute, private product: ProductSerService, private rout:Router) { }
  ngOnInit(): void {
    this.loadDetails();
  }

  loadDetails(): void {
    if (!this.isDetailsLoad) {
      this.isLoader = true;

      const query = this.router.snapshot.paramMap.get('query');
      const category = this.router.snapshot.paramMap.get('cat');

      if (query) {
        this.searchProduct(query);
      } else if (category) {
        this.filterProduct(category);
      }

      this.isDetailsLoad = true;
    }
  }

  searchProduct(query: string): void {
    this.product.searchProductService(query).subscribe(
      (result) => {
        this.searchProductData = result;
        this.isLoader = false;
      },
      (error) => {
        console.error('Error fetching search product data:', error);
        // this.rout.navigate(['']);
        // Handle error as needed
        this.isLoader = false;
        if(query == 'Shirt') {
          this.searchProductData = this.staticShirt;
        }
        else if (query == 'T-Shirt'){
          this.searchProductData = this.staticTshirt;
        }
        else if (query == 'Jeans'){
          this.searchProductData = this.staticJeans;
        }
      }
    );
  }

  filterProduct(category: string): void {
    this.product.FilterProductService(category).subscribe(
      (result) => {
        if (result) {
          this.isLoader = false;
          this.searchProductData = result;
        }
      },
      (error) => {
        console.error('Error fetching filtered product data:', error);
        // this.rout.navigate(['']);
        // Handle error as needed
        this.isLoader = false;
        if(category == 'Shirt') {
          this.searchProductData = this.staticShirt;
        }
        else if (category == 'T-Shirt'){
          this.searchProductData = this.staticTshirt;
        }
        else if (category == 'Jeans'){
          this.searchProductData = this.staticJeans;
        }
      }
    );
  }
}