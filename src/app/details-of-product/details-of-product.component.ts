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
  }];
  isLoader: boolean = false;
  isLoader1: boolean = false;
  Selectsize: string = 'Select Size';
  productSize: number | undefined;
  removeCard: boolean = false;
  productQuantity: number = 1;
  detailsOfproduct: undefined | product;
  cartDetails: product | undefined;
  constructor(private product: ProductSerService, private route: ActivatedRoute, private router:Router) { }
  ngOnInit(): void {
    this.isLoader1 = true;
    let id = this.route.snapshot.paramMap.get('Productid');
    id && this.product.getProductservice(id).subscribe((result) => {  
      this.isLoader1 = false;
      console.log('PRODUCT DETAILS: ' + result);
      this.detailsOfproduct = result[0];
    }, (error) => {
      // this.router.navigate(['']);
      this.isLoader1 = false;
      if(id) {
        this.detailsOfproduct = this.staticProducts[parseInt(id, 10) - 1];
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
