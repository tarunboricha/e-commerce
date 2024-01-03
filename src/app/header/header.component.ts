import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductSerService } from '../services/product-ser.service';
import { product } from '../data-type';
import { faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @HostListener('document:click', ['$event']) onDocumentClick(event: any) {
    event.stopPropagation()
    this.showSidebar = false;
  }
  searchSuggestion: undefined | product[];
  SellerName: undefined | string;
  Username: undefined | string;
  CartItem: number = 0;
  switchCaseCondition: string = 'default';
  showSidebar: boolean = false;
  barIcon = faBars;
  constructor(private router: Router, private product: ProductSerService) { }
  ngOnInit(): void {
    this.router.events.subscribe((value: any) => {
      if (value.url) {
        if (localStorage.getItem('seller') && value.url.includes('seller')) {
          this.switchCaseCondition = 'seller';
          let sellerTemp = localStorage.getItem('seller');
          let sellerData = sellerTemp && JSON.parse(sellerTemp)[0];
          this.SellerName = sellerData.name;
        }
        else if (!localStorage.getItem('user')) {
          this.switchCaseCondition = 'default';
        }
        else {
          this.switchCaseCondition = 'user';
          let UserTemp = localStorage.getItem('user');
          let UserData = UserTemp && JSON.parse(UserTemp)[0];
          this.Username = UserData.name;
          this.product.getCartlist(UserData.userID);
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
    localStorage.removeItem('user');
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
