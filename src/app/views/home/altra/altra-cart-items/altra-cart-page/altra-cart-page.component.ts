import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/models';
import { AccountService, OrderService } from 'src/services';

@Component({
  selector: 'app-altra-cart-page',
  templateUrl: './altra-cart-page.component.html',
  styleUrls: ['./altra-cart-page.component.scss']
})
export class AltraCartPageComponent implements OnInit {
  order: Order;
  carttItems: number;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.orderService.OrderObservable.subscribe(data => {
      this.order = data;
      this.carttItems = 0;
      if (this.order && this.order.Orderproducts)
        this.carttItems = this.order.Orderproducts.length
    })
  }

  checkout() {
    this.router.navigate([`shopping/checkout/${this.order.OrdersId || 'add'}/information`])
  }

  show() {
    this.router.navigate([`/products`])
  }
}
