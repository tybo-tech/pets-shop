import { Component, Input, OnInit } from '@angular/core';
import { User, Order } from 'src/models';

@Component({
  selector: 'app-altra-payment-methods',
  templateUrl: './altra-payment-methods.component.html',
  styleUrls: ['./altra-payment-methods.component.scss']
})
export class AltraPaymentMethodsComponent implements OnInit {
  @Input() user: User;
  @Input()order: Order;


  constructor() { }

  ngOnInit(): void {
  }

}
