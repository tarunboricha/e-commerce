import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { tokenInterceptor } from './services/token.interceptor';
import { NgbModule, NgbCarouselModule, NgbRatingModule} from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserCartComponent } from './user-cart/user-cart.component';
import { SellerComponent } from './seller/seller.component';
import { SigninComponent } from './signin/signin.component';
import { UserComponent } from './user/user.component';
import { SearchComponent } from './search/search.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { FooterComponent } from './footer/footer.component';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';
import { SellerAddProductComponent } from './seller-add-product/seller-add-product.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { SellerUpdateProductComponent } from './seller-update-product/seller-update-product.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    UserCartComponent,
    SellerComponent,
    SigninComponent,
    UserComponent,
    SearchComponent,
    ProductDetailComponent,
    FooterComponent,
    SellerDashboardComponent,
    SellerAddProductComponent,
    ProductFormComponent,
    SellerUpdateProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    NgbCarouselModule,
    FormsModule,
    ReactiveFormsModule,
    NgbRatingModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: tokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
