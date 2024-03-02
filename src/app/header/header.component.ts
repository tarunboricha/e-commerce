import { Component, HostListener, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProductSerService } from '../services/product-ser.service';
import { product } from '../data-type';
import { SellerSerService } from '../services/seller-ser.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  @ViewChild('componentContainer') componentContainer: ElementRef | undefined;

  constructor(private router: Router, private product: ProductSerService, protected seller: SellerSerService) { }

  height: number = 0;
  cartListRequestInProgress: boolean = false;
  currUrl: string = '';
  searchSuggestion: undefined | product[];
  SellerName: undefined | string;
  Username: undefined | string;
  CartItem: number = 0;
  switchCaseCondition: string = 'default';
  showSidebar: boolean = false;
  showSidenav: boolean = false;
  touchstartX: number = 0;
  touchendX: number = 0;

  ngOnInit(): void {
    this.product.cartData.subscribe((result) => {
      this.CartItem = result.length;
    });
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
            if (localStorage.getItem('LocaladdToCart')) {
              let Cart = localStorage.getItem('LocaladdToCart');
              let Cartdata = Cart && JSON.parse(Cart);
              this.CartItem = Cartdata.length;
            }
          }
          else {
            this.currUrl = value.url;
            this.switchCaseCondition = 'user';
            let UserTemp = localStorage.getItem('4uUser');
            let UserData = UserTemp && JSON.parse(UserTemp)[0];
            this.Username = UserData.name;
            if (!this.cartListRequestInProgress) {
              this.cartListRequestInProgress = true;
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
  }

  ngAfterViewInit() {
    // Measure the height after the view and child views are initialized
    if(this.componentContainer){
      if(this.componentContainer.nativeElement.offsetWidth > 576)
        this.height = this.componentContainer.nativeElement.offsetHeight;
    }
  }

  scrollTop() {
    window.scroll({
      top: 0,
      left: 0
    });
  }

  CategoryProducts(data: string) {
    this.showSidenav = false;
    this.router.navigate(['']);
    setTimeout(() => {
      this.router.navigate(['category/' + data]);
    }, 0);
  }

  searchProducts(data: string) {
    data = data.toLowerCase().replace(/\W/g, '');
    this.router.navigate(['']);
    setTimeout(() => {
      this.router.navigate(['/search/' + data]);
    }, 0.0001);
  }

  SellerLogoutfun() {
    this.currUrl = '';
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
