import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SellerSerService } from './services/seller-ser.service';

@Injectable({
  providedIn: 'root'
})
export class SellerAuthenticationGuard implements CanActivate {
  constructor(private seller: SellerSerService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (localStorage.getItem('seller')) {
      return true;
    }
    return this.seller.checkSellerlogin;
  }
}
