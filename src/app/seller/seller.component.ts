import { Component, OnInit } from '@angular/core';
import { SellerSerService } from '../services/seller-ser.service';
import { Login } from '../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.css']
})
export class SellerComponent implements OnInit {

  isLoader: boolean = false;
  SellerLoginfailed:undefined|string;
  constructor(private sellsign: SellerSerService, private router: Router) { }
  ngOnInit(): void {
    this.sellsign.sellerReloadpage();
  }

  login(data: Login) {
    if (data.email == '' || data.password == '') {
      this.SellerLoginfailed = "Fields are Empty.";
      setTimeout(()=>this.SellerLoginfailed = undefined, 2000);
    }
    else {
      this.isLoader = true;
      this.sellsign.sellerLoginservice(data).subscribe((result: any) => {
        if (result && result.body && result.body.length) {
          this.isLoader = false;
          localStorage.setItem('seller', JSON.stringify(result.body));
          this.router.navigate(['seller-homepage']);
        }
        else {
          this.isLoader = false;
          this.SellerLoginfailed = "Email or Passwrod is not correct";
          setTimeout(()=>this.SellerLoginfailed = undefined, 2000);
        }
      });
    }
  }
}
