import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, User } from 'src/models';
import { Item } from 'src/models/item.model';
import { AccountService, OrderService } from 'src/services';
import { ItemService } from 'src/services/item.service';
import { CHECKOUT_PAGES, ITEM_TYPES } from 'src/shared/constants';

@Component({
  selector: 'app-altra-checkout',
  templateUrl: './altra-checkout.component.html',
  styleUrls: ['./altra-checkout.component.scss']
})
export class AltraCheckoutComponent implements OnInit {
  orderId: string;
  page: string;
  order: Order;
  CHECKOUT_PAGES = CHECKOUT_PAGES;
  user: User;
  websiteLogo: Item;
  navBarTheme: Item;
  navClass: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private orderService: OrderService,
    private itemService: ItemService,
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.orderId = r.id;
      this.page = r.page;
      this.getOrder();
      // alert(this.orderId + ' ' + this.page)
    });
  }
  getOrder() {
    this.orderService.OrderObservable.subscribe(data => {
      this.order = data;
    });

    this.accountService.user.subscribe(data => {
      this.user = data;
    })
  }

  ngOnInit(): void {
    this.getItems();
  }
  checkout() { }
  getItems() {
    this.itemService.ItemListObservable.subscribe(data => {
      if (data && data.length)
        this.websiteLogo = data.find(x => x.ItemType === ITEM_TYPES.LOGO.Name);
      this.navBarTheme = data.find(x => x.ItemType === ITEM_TYPES.NAV_BARTHEME.Name);
      if (this.navBarTheme)
        this.navClass = this.navBarTheme.Description;

    })
  }
}
