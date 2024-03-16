import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SellerComponent } from './seller/seller.component';
import { SellerHomepageComponent } from './seller-homepage/seller-homepage.component';
import { SellerAuthenticationGuard } from './seller-authentication.guard';
import { SellerAddProductComponent } from './seller-add-product/seller-add-product.component';
import { SellerUpdateProductComponent } from './seller-update-product/seller-update-product.component';
import { SearchComponent } from './search/search.component';
import { DetailsOfProductComponent } from './details-of-product/details-of-product.component';
import { UserComponent } from './user/user.component';
import { AddToCartComponent } from './add-to-cart/add-to-cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { WishlistComponent } from './wishlist/wishlist.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'seller',
    component: SellerComponent,
  },
  {
    path: 'seller-homepage',
    component: SellerHomepageComponent,
    canActivate: [SellerAuthenticationGuard],
  },
  {
    path: 'seller-add-product',
    component: SellerAddProductComponent,
    canActivate: [SellerAuthenticationGuard],
  },
  {
    path: 'seller-update-product/:id',
    component: SellerUpdateProductComponent,
    canActivate: [SellerAuthenticationGuard],
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'product/:Productid',
    component: DetailsOfProductComponent
  },
  {
    path: 'user',
    component: UserComponent
  },
  {
    path: 'category',
    component: SearchComponent
  },
  {
    path: 'addToCart',
    component: AddToCartComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  { 
    path: 'wishlist', 
    component: WishlistComponent 
  },
  {
    path: 'my-orders',
    component: MyOrdersComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
