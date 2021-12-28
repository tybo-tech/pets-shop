import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, Orderproduct } from 'src/models';
import { OrderService } from 'src/services';

@Component({
  selector: 'app-altra-cart-items',
  templateUrl: './altra-cart-items.component.html',
  styleUrls: ['./altra-cart-items.component.scss']
})
export class AltraCartItemsComponent implements OnInit {
  order: Order;

  constructor(
    private orderService: OrderService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.orderService.OrderObservable.subscribe(data => {
      this.order = data;
    })
  }

  changeQty(qty: number, orderproduct: Orderproduct) {
    if (qty < 0 && Number(orderproduct.Quantity) <= 1)
      return;

    orderproduct.Quantity = Number(orderproduct.Quantity) + qty;
    this.orderService.calculateTotalOverdue(this.order);
    this.orderService.updateOrderState(this.order);
  }
  deleteFromCart(orderproduct: Orderproduct, index) {
    this.order.Orderproducts.splice(index, 1);
    if (this.order.Orderproducts.length === 0) {
      this.order = null;
    }
    this.orderService.calculateTotalOverdue(this.order);
    this.orderService.updateOrderState(this.order);
  }

  checkout() {
    this.router.navigate([`shopping/checkout/${this.order.OrdersId || 'add'}/information`])
  }

  goshop() {
    this.router.navigate([`/products`])
  }
}
