import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, User } from 'src/models';
import { Item } from 'src/models/item.model';
import { AccountService, OrderService } from 'src/services';
import { ItemService } from 'src/services/item.service';
import { UxService } from 'src/services/ux.service';
import { ADMIN, ITEM_TYPES, SUPER } from 'src/shared/constants';

@Component({
  selector: 'app-dash-nav',
  templateUrl: './dash-nav.component.html',
  styleUrls: ['./dash-nav.component.scss']
})
export class DashNavComponent implements OnInit {
  user: User;
  isAdmin: boolean;
  isSuper: boolean;
  showNav: boolean;
  item;
  websiteLogo: Item;
  order: Order;
  constructor(
    private accountService: AccountService,
    private router: Router,
    private uxService: UxService,
    private itemService: ItemService,
    private orderService: OrderService,



  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (!this.user) {
      this.router.navigate(['']);
      return;
    }
    this.isAdmin = this.user.UserType === ADMIN;
    this.isSuper = this.user.UserType === SUPER;
    if (this.isSuper) {
    }
    this.getSettings();

    this.orderService.OrderObservable.subscribe(data => {
      this.order = data;
    });

  }
  toggleNav() {
    this.uxService.hideHomeSideNav();
    window.scroll(0, 0);
  }
  list(item) {
    this.router.navigate([`admin/dashboard/${item}`]);
  }


  logout() {
    this.accountService.updateUserState(null);
    this.router.navigate(['']);
  }
  getSettings() {
    this.itemService.ItemListObservable.subscribe(data => {
      if (data && data.length)
        this.websiteLogo = data.find(x => x.ItemType === ITEM_TYPES.LOGO.Name);

    })
  }
  cart() {
    this.router.navigate(['/admin/dashboard/create-order/products']);
    this.showNav = false;
  }

  goto(url) {
    this.router.navigate([`/admin/dashboard/${url}`]);
    this.showNav = false;
  }
}
