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

  @HostListener('document:click', ['$event']) onDocumentClick(event: any) {
    event.stopPropagation()
    this.showSidebar = false;
  }
  currUrl: string = '';
  searchSuggestion: undefined | product[];
  SellerName: undefined | string;
  Username: undefined | string;
  CartItem: number = 0;
  switchCaseCondition: string = 'default';
  showSidebar: boolean = false;
  barIcon = faBars;
  constructor(private router: Router, private product: ProductSerService, protected seller:SellerSerService) { }
  ngOnInit(): void {
    console.log('headeroninitCalled');
    this.router.events.subscribe((value: any) => {
      if (value.url) {
        if(this.currUrl != value.url){
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
      if(localStorage.getItem('LocaladdToCart')){
        let Cart = localStorage.getItem('LocaladdToCart');
        let Cartdata = Cart && JSON.parse(Cart);
        this.CartItem = Cartdata.length;
      }
      else{
        this.product.cartData.subscribe((result) => {
          this.CartItem = result.length;
        });
      }
    }, 1);
  }
  
  SearchSuggetionfun(data: KeyboardEvent) {
    if (data) {
      const search = data.target as HTMLInputElement;
      this.product.searchSuggestionservice(search.value).subscribe((result) => {
        if (result.length > 5) {
          result.length = 5;
        }
        this.searchSuggestion = result;
      })
    }
  }
  flipSidebar() {
    if (this.showSidebar)
      this.showSidebar = false;
    else
      this.showSidebar = true;
  }
  searchProducts(data: string) {
    this.router.navigate(['']);
    setTimeout(() => {
      this.router.navigate(['/search/' + data]);
    }, 0.0001);
  }
  CategoryProducts(data: string) {
    this.router.navigate(['']);
    setTimeout(() => {
      this.router.navigate(['category/' + data]);
    }, 0.0001);
  }
  HideSuggestion(data:boolean) {
    if(data){
      setTimeout(() => {
        this.searchSuggestion = undefined;
      }, 80);
    }
    else{
      this.searchSuggestion = undefined;
    }
  }
  SellerLogoutfun() {
    localStorage.removeItem('seller');
    this.router.navigate(['']);
  }
  UserLogoutfun() {
    localStorage.removeItem('4uUser');
    this.product.cartData.emit([]);
    this.router.navigate(['']);
  }
  redirectPage(data: number) {
    this.router.navigate(['']);
    setTimeout(() => {
      this.router.navigate([`/product/${data}`]);
    }, 1);
  }
}
