import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserCartComponent } from './user-cart/user-cart.component';
import { HomeComponent } from './home/home.component';
import { SellerComponent } from './seller/seller.component';
import { UserComponent } from './user/user.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { SearchComponent } from './search/search.component';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';
import { SellerAddProductComponent } from './seller-add-product/seller-add-product.component';
import { SellerUpdateProductComponent } from './seller-update-product/seller-update-product.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'seller',
    component: SellerComponent
  },
  {
    path: 'viewcart',
    component: UserCartComponent
  },
  {
    path: 'user',
    component: UserComponent
  },
  {
    path: 'product/:pID',
    component: ProductDetailComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'category',
    component: SearchComponent
  },
  {
    path: 'seller-dashboard',
    component: SellerDashboardComponent
  },
  {
    path: 'seller-add-product',
    component: SellerAddProductComponent
  },
  {
    path: 'seller-update-product/:id',
    component: SellerUpdateProductComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
