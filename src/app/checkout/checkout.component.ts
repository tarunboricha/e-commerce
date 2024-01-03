import { Component, OnInit } from '@angular/core';
import { ProductSerService } from '../services/product-ser.service';
import { Router } from '@angular/router';
import { addToCart, order } from '../data-type';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  totalPrice: number | undefined;
  orderMsg: string | undefined;
  constructor(private product: ProductSerService, private router: Router) { }
  ngOnInit(): void {
    if (localStorage.getItem('user')) {
      this.product.cartData.subscribe((result) => {
        if (result.length) {
          let price = 0;
          if (result.length) {
            result.forEach((item) => {
              if (item.productQuantity) {
                price = price + (+item.productPrice * +item.productQuantity)
              }
            })
            this.totalPrice = price + 100;
          }
        }
      });
    }
    else {
      this.router.navigate(['']);
    }
  }

  orderNow(data: { email: string, address: string, contact: string }) {
    if (!(data.email == '' && data.address == '' && data.contact.length!=10)) {
      let user = localStorage.getItem('user');
      let userId = user && JSON.parse(user).id;
      if (this.totalPrice) {
        let orderData: order = {
          ...data,
          totalPrice: this.totalPrice,
          userId,
          id: undefined
        }

        this.product.cartData.subscribe((result) => {
          result.forEach((item) => {
            setTimeout(() => {
              item.id && this.product.deleteCartItems(item.id);
            }, 50)
          })
        })

        this.product.orderNow(orderData).subscribe((result) => {
          if (result) {
            this.orderMsg = "Order has been placed";
            setTimeout(() => {
              this.orderMsg = undefined;
              this.router.navigate(['/my-orders'])
            }, 1000);
          }

        })
      }
    }
  }

}
