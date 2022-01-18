import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { AccountService } from 'src/services/account.service';
import { TokenModel } from 'src/models/account.model';
import { ADMIN, CUSTOMER, IMAGE_DONE, IMAGE_WARN, ITEM_TYPES, SUPER } from 'src/shared/constants';
import { OrderService } from 'src/services/order.service';
import { Order } from 'src/models';
import { ModalModel } from 'src/models/modal.model';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { UxService } from 'src/services/ux.service';
import { NavHistoryUX } from 'src/models/UxModel.model';
import { ItemService } from 'src/services/item.service';
import { Item } from 'src/models/item.model';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  
  email = environment.ACCOUNT_TEST_EMAIL;
  password = environment.ACCOUNT_TEST_PASSWORD;
  hidePassword = true;
  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Go to login',
    routeTo: 'home/sign-in',
    img: undefined
  };
  error: string;
  loading: boolean;
  backTo: any;



  constructor(
    private routeTo: Router,
    private accountService: AccountService,
    private location: LocationStrategy,
    private uxService: UxService,
    private _location: Location,
    private activatedRoute: ActivatedRoute



  ) {
    this.activatedRoute.params.subscribe(r => {
      this.backTo = r.id;
    });
  }


  ngOnInit() {

  }

  goto(url) {
    this.routeTo.navigate(['home/sign-in']);
    this.routeTo.navigate([url]);
  }

  back() {

    this.routeTo.navigate(['']);
  }




  Login() {
    this.error = undefined;
    if (!this.email) {
      this.error = 'Please enter your username.'
      return
    }
    if (!this.password) {
      this.error = 'Please enter your password.'
      return
    }
    this.loading = true;
    this.accountService.login({ email: this.email, password: this.password }).subscribe(user => {
      this.loading = false;
      if (user && user.UserId) {
        this.error = '';
        this.accountService.updateUserState(user);
        if (this.backTo) {
          this.backTo = this.backTo.split('_').join('/');
          this.routeTo.navigate([this.backTo]);
          return;
        }
        this.routeTo.navigate(['admin/dashboard']);
      }
      else {
        let err: any = user;
        this.error = 'Username or password is incorrect';
      }
    });
  }


}
