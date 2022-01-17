import { Component, OnInit } from '@angular/core';
import { Order } from 'src/models';
import { OrderService } from 'src/services';
import { DELIVERY_TYPES } from 'src/shared/constants';

@Component({
  selector: 'app-altra-cart-totals',
  templateUrl: './altra-cart-totals.component.html',
  styleUrls: ['./altra-cart-totals.component.scss']
})
export class AltraCartTotalsComponent implements OnInit {
  order: Order;
  DELIVERY_TYPES = DELIVERY_TYPES;
  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.orderService.OrderObservable.subscribe(data => {
      this.order = data;
    })
  }

}
