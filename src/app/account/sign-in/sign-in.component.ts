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
  @Output() navAction: EventEmitter<boolean> = new EventEmitter<boolean>();

  showMobileNav;
  rForm: FormGroup;
  error: string;
  loading$: Observable<boolean>;
  email: string = '';
  password: string = '';
  hidePassword = true;
  shopSecondaryColor;
  shopPrimaryColor;
  logoUrl;
  token: string;
  showLoader: boolean = false;
  order: Order;
  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Go to login',
    routeTo: 'sign-in',
    img: undefined
  };
  navHistory: NavHistoryUX;
  showAdd: boolean;
  websiteLogo: Item;
  backTo: string;

  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private accountService: AccountService,
    private location: LocationStrategy,
    private orderService: OrderService,
    private uxService: UxService,
    private _location: Location,
    private itemService: ItemService,
    private activatedRoute: ActivatedRoute,



  ) {
    this.activatedRoute.params.subscribe(r => {
      this.backTo = r.id;
    });
  }


  ngOnInit() {
    if (!environment.production) {

    }
    this.getSettings();
    this.order = this.orderService.currentOrderValue;
    this.rForm = this.fb.group({
      Email: new FormControl(
        this.email,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])
      ),
      Password: [this.password, Validators.required]
    });
    this.loading$ = this.accountService.loading;
    const baseUrlMain: string = (this.location as any)._platformLocation.location.href;
    this.token = baseUrlMain.substring(baseUrlMain.indexOf('=') + 1);
    // this.activateUser();
    this.uxService.uxNavHistoryObservable.subscribe(data => {
      this.navHistory = data;
    })
  }
  getSettings() {
    this.itemService.ItemListObservable.subscribe(data => {
      if (data && data.length)
        this.websiteLogo = data.find(x => x.ItemType === ITEM_TYPES.LOGO.Name);

    })
  }
  goto(url) {
    this.routeTo.navigate(['sign-in']);
    this.routeTo.navigate([url]);
  }

  back() {
    if (this.navHistory && this.navHistory.BackToAfterLogin) {
      this.routeTo.navigate([this.navHistory.BackToAfterLogin]);
    } else {
      this.routeTo.navigate(['']);
    }
  }
  // togo
  activateUser() {
    const tokenModel: TokenModel = { Token: this.token };
    if (tokenModel.Token) {
      this.accountService.activateUser(tokenModel)
        .subscribe(data => {
          if (data > 0) {
            alert('Account successfully activated, Please login');
            return;
          }
        });
    }
  }

  get getFormValues() {
    return this.rForm.controls;
  }

  Login() {
    const email = this.getFormValues.Email.value;
    const password = this.getFormValues.Password.value;
    this.showLoader = true;
    this.accountService.login({ email, password }).subscribe(user => {
      if (user && user.UserId) {
        this.error = '';
        this.accountService.updateUserState(user);
        if (this.backTo) {
          debugger
          this.backTo = this.backTo.split('_').join('/');
          this.routeTo.navigate([this.backTo]);
          return;
        }
        if (user.UserType === ADMIN) {
          this.routeTo.navigate(['admin/dashboard']);
          return;
        }
        if (user.UserType === SUPER) {
          this.routeTo.navigate(['admin/dashboard']);
          return;
        }
        if (user.UserType === CUSTOMER) {
          if (this.order && this.order.CustomerId === 'checked') {
            this.order.CustomerId = user.UserId;
            this.order.Customer = user;
            this.orderService.updateOrderState(this.order);
            this.routeTo.navigate(['shop/checkout']);
          } else {
            this.routeTo.navigate(['']);
          }
          return;
        }
        this.showLoader = false;
      }
      else {
        let err: any = user;
        this.error = err + '. , Or contact us if you did not get the mail.' || 'your email or password is incorrect';
        this.showLoader = false;
      }
    });
  }





}
