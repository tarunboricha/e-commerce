import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductSerService } from '../services/product-ser.service';
import { product } from '../data-type';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { SellerSerService } from '../services/seller-ser.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cartListRequestInProgress: boolean = false;
  currUrl: string = '';
  searchSuggestion: undefined | product[];
  SellerName: undefined | string;
  Username: undefined | string;
  CartItem: number = 0;
  switchCaseCondition: string = 'default';
  showSidebar: boolean = false;
  showSidenav: boolean = false;
  touchstartX:number = 0;
  touchendX:number = 0;
  constructor(private router: Router, private product: ProductSerService, protected seller: SellerSerService) { }
  ngOnInit(): void {
    document.addEventListener('touchstart', this.handleTouchStart, false);
    document.addEventListener('touchend', this.handleTouchEnd, false);
    console.log('headeroninitCalled');
    this.router.events.subscribe((value: any) => {
      if (value.url) {
        if (this.currUrl != value.url) {
          if (localStorage.getItem('seller') && value.url.includes('seller')) {
            this.currUrl = value.url;
            this.switchCaseCondition = 'seller';
            let sellerTemp = localStorage.getItem('seller');
            let sellerData = sellerTemp && JSON.parse(sellerTemp)[0];
            this.SellerName = sellerData.name;
          }
          else if (!localStorage.getItem('4uUser')) {
            this.currUrl = value.url;
            this.switchCaseCondition = 'default';
          }
          else {
            this.currUrl = value.url;
            this.switchCaseCondition = 'user';
            let UserTemp = localStorage.getItem('4uUser');
            let UserData = UserTemp && JSON.parse(UserTemp)[0];
            this.Username = UserData.name;
            if (!this.cartListRequestInProgress) {
              this.cartListRequestInProgress = true;

              // Make the API call
              this.product.getCartlist(UserData.userID, 'headerOninit')
                .add(() => {
                  // Set the flag to false when the request is complete, whether successful or not
                  this.cartListRequestInProgress = false;
                });
            }
          }
        }
      }
    });
    setTimeout(() => {
      if (localStorage.getItem('LocaladdToCart')) {
        let Cart = localStorage.getItem('LocaladdToCart');
        let Cartdata = Cart && JSON.parse(Cart);
        this.CartItem = Cartdata.length;
      }
      else {
        this.product.cartData.subscribe((result) => {
          this.CartItem = result.length;
        });
      }
    }, 1);
  }

  handleTouchStart(event:any) {
    this.touchstartX = event.changedTouches[0].screenX;
  }

  // Function to handle touch end event
  handleTouchEnd(event:any) {
    this.touchendX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  // Function to handle swipe gesture
  handleSwipe() {
    if (this.touchendX - this.touchstartX > 50) { // Minimum swipe distance
      this.showSidenav = true;
    }
  }

  CategoryProducts(data: string) {
    this.showSidenav = false;
    this.router.navigate(['']);
    setTimeout(() => {
      this.router.navigate(['category/' + data]);
    }, 0);
  }

  searchProducts(data: string) {
    this.router.navigate(['']);
    setTimeout(() => {
      this.router.navigate(['/search/' + data]);
    }, 0.0001);
  }

  SellerLogoutfun() {
    localStorage.removeItem('seller');
    this.router.navigate(['']);
  }

  UserLogoutfun() {
    this.currUrl = '';
    localStorage.removeItem('4uUser');
    this.product.cartData.emit([]);
    this.router.navigate(['']);
  }
}
