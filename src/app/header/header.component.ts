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

  constructor(private router: Router, protected product: ProductSerService, protected seller: SellerSerService) { }

  @HostListener('document:click', ['$event']) onDocumentClick(event: any) {
    if (this.showSidenav) {
      this.showSidenav = false;
    }
  }

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
  isServerDown: boolean = false;
  isUserLogin:boolean = false;

  ngOnInit(): void {
    this.product.cartData.subscribe((result:any) => {
      let temp = 0;
      for(let i = 0; i<result.length; i++) {
        if(!result[i].savelater) {
          temp = temp + 1;
        }
      }
      this.CartItem = temp;
    });
    this.product.isServerDown.subscribe((result) => {
      if (result && this.isUserLogin) {
        this.isServerDown = true;
        setTimeout(() => {
          this.isServerDown = false;
          this.UserLogoutfun();
        }, 2000);
      }
    });
    this.router.events.subscribe((value: any) => {
      document.body.classList.remove('disable-scroll');
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
              setTimeout(() => {
                this.product.cartData.emit(Cartdata);
              }, 0);
            }
            else {
              setTimeout(() => {
                this.product.cartData.emit([]);
              }, 0);
            }
          }
          else {
            this.currUrl = value.url;
            this.isUserLogin = true;
            this.switchCaseCondition = 'user';
            let UserTemp = localStorage.getItem('4uUser');
            let UserData = UserTemp && JSON.parse(UserTemp)[0];
            this.Username = UserData.name;
            if (!this.cartListRequestInProgress) {
              this.cartListRequestInProgress = true;
              this.product.getCartlist(UserData.userID, 'headerOninit')
                .add(() => {
                  this.cartListRequestInProgress = false;
                });
            }
          }
        }
      }
    });
  }

  toogle() {
    if (!this.showSidenav) {
      this.showSidenav = true;
      document.body.classList.add('disable-scroll');
    }
    else {
      this.showSidenav = false;
      document.body.classList.remove('disable-scroll');
    }
  }

  ngAfterViewInit() {
    // Measure the height after the view and child views are initialized
    if (this.componentContainer) {
      this.product.headerComHeight = this.componentContainer.nativeElement.offsetHeight;
    }
    if(this.componentContainer?.nativeElement.offsetWidth < 536) {
      this.product.isMobile = true;
    }
  }

  scrollTop() {
    window.scroll({
      top: 0,
      left: 0
    });
  }

  CategoryProducts(data: string) {
    data = data.toLowerCase().replace(/\W/g, '');
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
    this.isUserLogin = false;
    localStorage.removeItem('4uUser');
    this.product.cartData.emit([]);
    this.router.navigate(['']);
  }
}