import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, User } from 'src/models';
import { Company } from 'src/models/company.model';
import { Item } from 'src/models/item.model';
import { AccountService, OrderService } from 'src/services';
import { ItemService } from 'src/services/item.service';
import { UxService } from 'src/services/ux.service';
import { ADMIN, COMPANY_TYPE, ITEM_TYPES, NAV_HOME, NAV_HOME_NOT_LOGGEN_IN, ORDER_TYPE_SALES } from 'src/shared/constants';

@Component({
  selector: 'app-home-nav',
  templateUrl: './home-nav.component.html',
  styleUrls: ['./home-nav.component.scss']
})
export class HomeNavComponent implements OnInit {
  carttItems = 0;
  companies: Company[];
  showMenu: boolean;
  websiteLogo: Item;

  order: Order;
  user: User;
  NAV_HOME = NAV_HOME;
  NAV_HOME_NOT_LOGGEN_IN = NAV_HOME_NOT_LOGGEN_IN;
  ADMIN = ADMIN;
  navClass = 'dark-nav';
  navBarTheme: Item;
  constructor(
    private uxService: UxService,
    private router: Router,
    private orderService: OrderService,
    private accountService: AccountService,
    private itemService: ItemService,

  ) {

  }

  ngOnInit() {
    this.accountService.user.subscribe(data => {
      this.user = data;
    })
    this.uxService.uxHomeSideNavObservable.subscribe(data => {
      this.showMenu = data;
    })

    this.order = this.orderService.currentOrderValue;
    if (!this.order) {
      this.order = {
        OrdersId: '',
        OrderNo: 'Shop',
        CompanyId: '',
        CustomerId: '',
        AddressId: '',
        Notes: '',
        OrderType: ORDER_TYPE_SALES,
        Total: 0,
        Paid: 0,
        Due: 0,
        InvoiceDate: new Date(),
        DueDate: '',
        CreateUserId: 'shop',
        ModifyUserId: 'shop',
        Status: 'Not paid',
        StatusId: 1,
        Orderproducts: []
      }
      this.orderService.updateOrderState(this.order);
    }

    this.orderService.OrderObservable.subscribe(data => {
      if (!data || !data.Orderproducts)
        this.carttItems = 0;
      else
        this.carttItems = this.order.Orderproducts.length;
    });

    this.itemService.ItemListObservable.subscribe(data => {
      if (data && data.length)
        this.websiteLogo = data.find(x => x.ItemType === ITEM_TYPES.LOGO.Name);
      this.navBarTheme = data.find(x => x.ItemType === ITEM_TYPES.NAV_BARTHEME.Name);
      if (this.navBarTheme)
        this.navClass = this.navBarTheme.Description;

    })
  }

  cart() {
    this.router.navigate(['shop/cart']);
  }

  logout() {
    this.accountService.logout();
  }

}
