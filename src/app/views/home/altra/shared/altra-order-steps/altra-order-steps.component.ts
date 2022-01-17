import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Order } from 'src/models';
import { CHECKOUT_PAGES, ORDER_STEPS } from 'src/shared/constants';

@Component({
  selector: 'app-altra-order-steps',
  templateUrl: './altra-order-steps.component.html',
  styleUrls: ['./altra-order-steps.component.scss']
})
export class AltraOrderStepsComponent implements OnInit {

  @Input() order: Order;
  @Input() page: string;
  items: AltraBread2[];
  id: any;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private messageService: MessageService
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.id = r.id;
      this.page = r.step;
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    if (this.order) {
      this.items = [
        { Class: 'fas fa-user', Url: '', Name: 'Customer', MainClass: 'btn btn-light btn-circle', Page: ORDER_STEPS.CUSTOMER.Name },
        { Class: 'fa fa-shopping-cart', Url: '', Name: 'Products', MainClass: 'btn btn-light btn-circle', Page: ORDER_STEPS.PRODUCTS.Name },
        { Class: 'fas fa-truck', Url: '', Name: 'Checkout', MainClass: 'btn btn-light btn-circle', Page: ORDER_STEPS.SHIPPING.Name },
        // { Class: 'fas fa-money-bill-wave-alt', Url: '', Name: 'Finish', MainClass: 'btn btn-light btn-circle', Page: ORDER_STEPS.PAYMENTS.Name },
      ];

      const item = this.items.find(x => x.Page === this.page);
      if (item)
        this.selectItem(item);

    }
  }
  selectItem(item: AltraBread2) {
    this.items.map(x => x.MainClass = 'btn btn-light btn-circle');
    item.MainClass = 'btn btn-primary btn-circle';
  }

  goto(item: AltraBread2) {

    if (this.order && !this.order.Customer) {
      this.messageService.add({ severity: 'error', summary: 'Please choose or create a customer', detail: '' });
      return;
    }
    if (item.Page === CHECKOUT_PAGES.SHIPPING.Name && this.order && this.order.Orderproducts && !this.order.Orderproducts.length) {
      this.messageService.add({ severity: 'error', summary: 'Cart is Empty', detail: 'Please add some products to this order' });
      return;
    }
    this.selectItem(item);
    this.router.navigate([`/admin/dashboard/create-order/${item.Page}`]);
  }
}


export interface AltraBread2 {
  Class: string;
  Url: string;
  Name: string;
  MainClass: string;
  Page: string;
}