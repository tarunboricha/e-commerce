import { Component, OnInit } from '@angular/core';
import { SellerSerService } from '../services/seller-ser.service';
import { signUp, Login } from '../data-type';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.css']
})
export class SellerComponent implements OnInit {

  SellerLoginfailed:undefined|string;
  constructor(private sellsign: SellerSerService) { }
  ngOnInit(): void {
    this.sellsign.sellerReloadpage();
  }

  login(data: Login) {
    if (data.email == '' || data.password == '') {
      this.SellerLoginfailed = "Fields are Empty.";
      setTimeout(()=>this.SellerLoginfailed = undefined, 2000);
    }
    else {
      this.sellsign.sellerLoginservice(data);
      this.sellsign.SellerLoginFailed.subscribe((check)=>{
        if(check){
          this.SellerLoginfailed = "Email or Passwrod is not correct";
          setTimeout(()=>this.SellerLoginfailed = undefined, 2000);
        }
      })
    }
  }
}
