import { Component, Input, OnInit } from '@angular/core';
import { Order } from 'src/models';

@Component({
  selector: 'app-altra-order-customer-sammary',
  templateUrl: './altra-order-customer-sammary.component.html',
  styleUrls: ['./altra-order-customer-sammary.component.scss']
})
export class AltraOrderCustomerSammaryComponent implements OnInit {
@Input() order: Order;
  constructor() { }

  ngOnInit(): void {
  }

}
