import { Component, HostListener, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavigationEnd, Router, Event } from '@angular/router';
import { ProductService } from '../services/product.service';
import { filter } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  @ViewChild('componentContainer') componentContainer: ElementRef | undefined;
  @HostListener('document:click', ['$event']) onDocumentClick(event: any) {
    if (this.showSidenav) {
      this.showSidenav = false;
    }
  }

  cartItems: number = 0;
  sellerName: undefined | string;
  userName: undefined | string;
  switchCaseCondition: string = 'default';
  searchQuery: string = '';
  showSidenav: boolean = false;
  isServerDown: boolean = false;
  isUserLogin: boolean = false;
  serverDownMessage: string | undefined;
  sellerSearch = new FormControl('', { nonNullable: true });

  constructor(private router: Router, private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.userCartData.subscribe((cartItems: any) => {
      const notSaveLaterItemCount = cartItems.filter((item: { savelater: boolean; }) => !item.savelater).length;
      this.cartItems = notSaveLaterItemCount;
    });
    this.productService.isServerDown.subscribe((serverDownMessage: boolean) => {
      if (this.isUserLogin) {
        this.UserLogoutfun();
        this.serverDownMessage = "Sorry, the server is currently down. You are being logged out."
      }
      else
        this.serverDownMessage = "Sorry, the server is currently down. You are exploring static website currently.";
      this.isServerDown = true;
      setTimeout(() => {
        this.isServerDown = false;
      }, 2000);
    });
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((value: NavigationEnd) => {
        document.body.classList.remove('disable-scroll');
        const userCartData = JSON.parse(localStorage.getItem('LocaladdToCart') || '[]');
        const sellerData = JSON.parse(localStorage.getItem('seller') || '[]');
        const userData = JSON.parse(localStorage.getItem('4uUser') || '[]')[0];

        if (!value.url.includes('search'))
          this.searchQuery = '';
        else {
          var queValue = new URL(value.url, "http://localhost:53418/#");
          let temp = queValue.searchParams.get('que');
          if (temp)
            this.searchQuery = temp;
        }
        if (localStorage.getItem('seller') && value.url.includes('seller')) {
          this.switchCaseCondition = 'seller';
          this.sellerName = sellerData?.name;
        } else if (!localStorage.getItem('4uUser')) {
          this.switchCaseCondition = 'default';
          setTimeout(() => {
            this.productService.userCartData.emit(userCartData);
          }, 0);
        } else {
          this.isUserLogin = true;
          this.switchCaseCondition = 'user';
          this.userName = userData?.first_name;
          this.productService.getUserCartlist(userData?.userID);
        }
      });
  }

  ngAfterViewInit() {
    this.productService.headerHeight = this.componentContainer?.nativeElement.offsetHeight;
    if (this.componentContainer?.nativeElement.offsetWidth < 536)
      this.productService.isMobile = true;
  }

  toogle() {
    this.showSidenav ? document.body.classList.remove('disable-scroll') : document.body.classList.add('disable-scroll');
    this.showSidenav = !this.showSidenav;
  }

  scrollTop() {
    window.scroll({
      top: 0,
      left: 0
    });
  }

  searchProducts(data: string) {
    if (data === '') {
      this.router.navigate(['']);
      return;
    }
    data = data.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '');
    this.router.navigate(['search'], { queryParams: { que: data, correc: true } });
  }

  sellerProductSearch(query: string) {
    this.productService.sellerProductSearch.emit(query);
  }

  SellerLogoutfun() {
    localStorage.removeItem('seller');
    this.router.navigate(['']);
  }

  UserLogoutfun() {
    this.isUserLogin = false;
    localStorage.removeItem('4uUser');
    this.userName = undefined;
    this.switchCaseCondition = 'default';
    this.productService.userCartData.emit([]);
  }
}