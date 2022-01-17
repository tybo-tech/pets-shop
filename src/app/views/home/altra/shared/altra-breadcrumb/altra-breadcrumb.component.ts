import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Order } from 'src/models';
import { CHECKOUT_PAGES } from 'src/shared/constants';

@Component({
  selector: 'app-altra-breadcrumb',
  templateUrl: './altra-breadcrumb.component.html',
  styleUrls: ['./altra-breadcrumb.component.scss']
})
export class AltraBreadcrumbComponent implements OnInit {
  @Input() order: Order;
  @Input() page: string;
  items: AltraBread[];
  id: any;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private messageService : MessageService
  ) { 
    this.activatedRoute.params.subscribe(r => {
      this.id = r.id;
      this.page = r.page;
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    if (this.order) {
      this.items = [
        { Class: 'fa fa-shopping-cart', Url: '', Name: 'Cart', MainClass: 'btn btn-light btn-circle', Page: CHECKOUT_PAGES.CART.Name },
        { Class: 'fas fa-user', Url: '', Name: 'Info', MainClass: 'btn btn-light btn-circle', Page: CHECKOUT_PAGES.INFO.Name },
        { Class: 'fas fa-truck', Url: '', Name: 'Shipping', MainClass: 'btn btn-light btn-circle', Page: CHECKOUT_PAGES.SHIPPING.Name },
        { Class: 'fas fa-money-bill-wave-alt', Url: '', Name: 'Payment', MainClass: 'btn btn-light btn-circle', Page: CHECKOUT_PAGES.PAYMENTS.Name },
      ];

      const item = this.items.find(x => x.Page === this.page);
      if (item)
        this.selectItem(item);

    }
  }
  selectItem(item: AltraBread) {
    this.items.map(x => x.MainClass = 'btn btn-light btn-circle');
    item.MainClass = 'btn btn-black btn-circle';
  }

  goto(item: AltraBread) {
    if (item.Page === CHECKOUT_PAGES.CART.Name) {
      this.router.navigate([`/view-cart`]);
      return;
    }

    if(this.order && !this.order.Customer){
      this.messageService.add({ severity: 'error', summary: 'Please enter your details or login if you already have the account', detail: '' });
      return;
    }
    if(item.Page === CHECKOUT_PAGES.PAYMENTS.Name && this.order && !this.order.Shipping){
      this.messageService.add({ severity: 'error', summary: 'Please choose delivery or branch collection', detail: '' });
      return;
    }
    this.selectItem(item);
    this.router.navigate([`/shopping/checkout/${this.order.OrdersId || 'add'}/${item.Page}`]);
  }
}


export interface AltraBread {
  Class: string;
  Url: string;
  Name: string;
  MainClass: string;
  Page: string;
}