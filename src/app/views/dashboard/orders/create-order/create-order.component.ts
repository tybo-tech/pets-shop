import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/models/order.model';
import { Shipping } from 'src/models/shipping.model';
import { User } from 'src/models/user.model';
import { AccountService } from 'src/services/account.service';
import { OrderService } from 'src/services/order.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit {
  user: User;
  order: Order;
  shippings: Shipping[];
  step: any;
  orderId: any;
  constructor(
    private router: Router,
    private accountService: AccountService,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,

  ) {

    this.activatedRoute.params.subscribe(r => {
      this.step = r.step;
      this.orderId = r.id;
      if (this.orderId) {
        orderService.getOrderSync(this.orderId).subscribe(data => {
          this.order = data;
          orderService.updateOrderState(this.order);
        })
      }
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.order = this.orderService.currentOrderValue;
  }

  back() {
    this.router.navigate([`/admin/dashboard/invoices/all`]);
  }
}

