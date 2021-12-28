import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, Orderproduct } from 'src/models';
import { OrderService } from 'src/services';
import { DELIVERY_TYPES } from 'src/shared/constants';

@Component({
  selector: 'app-altra-cart-sammary',
  templateUrl: './altra-cart-sammary.component.html',
  styleUrls: ['./altra-cart-sammary.component.scss']
})
export class AltraCartSammaryComponent implements OnInit {

  order: Order;
  showCart: boolean;
  DELIVERY_TYPES = DELIVERY_TYPES;
  constructor(
    private orderService: OrderService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.orderService.OrderObservable.subscribe(data => {
      this.order = data;
      // if (this.order || !this.order.ShippingPrice)
      //   this.order.ShippingPrice = 0;
      if (this.order)
        this.order.GrandTotal = Number(this.order.Total) + Number(this.order.ShippingPrice)
    })
  }



  continnueShopping() {
    this.router.navigate([`shopping/checkout`])
  }

}
