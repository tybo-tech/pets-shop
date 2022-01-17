import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/services';

@Component({
  selector: 'app-order-success-admin',
  templateUrl: './order-success-admin.component.html',
  styleUrls: ['./order-success-admin.component.scss']
})
export class OrderSuccessAdminComponent implements OnInit {
  @Input() orderId: any;

  constructor(private router: Router, private orderService: OrderService) { }

  ngOnInit(): void {
  }
  close() { this.router.navigate([`/admin/dashboard`]) }
  newOrder() {
    this.orderService.initOrder(true);
    this.router.navigate([`/admin/dashboard/create-order/customer`])

  }
  back() { 
    this.router.navigate([`/admin/dashboard/order/${this.orderId}`])

  }
}
