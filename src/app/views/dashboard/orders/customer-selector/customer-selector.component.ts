import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Order } from 'src/models';
import { OrderService, UserService } from 'src/services';
import { CUSTOMER } from 'src/shared/constants';
import { User } from 'c:/ndu/apps/pets-shop/src/models/user.model';

@Component({
  selector: 'app-customer-selector',
  templateUrl: './customer-selector.component.html',
  styleUrls: ['./customer-selector.component.scss']
})
export class CustomerSelectorComponent implements OnInit {

  @Input() items: any[];
  @Input() user: User;
  @Output() doneSelectingCustomer: EventEmitter<any> = new EventEmitter<any>();
  users: User[];
  searchString: string
  order: Order;
  selecting: boolean = true;
  constructor(
    private router: Router,
    private orderService: OrderService,
    private userService: UserService,
    private messageService: MessageService,

  ) { }

  ngOnInit() {

    this.orderService.OrderObservable.subscribe(data => {
      this.order = data;
      if (this.order && this.order.CustomerId && this.order.Customer) {
        this.selecting = false;
      }
    })
    this.userService.userListObservable.subscribe(data => {
      if (data && data.length)
        this.users = data.filter(x => Number(x.StatusId) === 1);
    });
    this.userService.getUsers(this.user.CompanyId, CUSTOMER);
  }
  selectItem(item: User) {
    if (!this.order)
      return;

    this.orderService.addCustomerToOrder(item);
    this.messageService.add({ severity: 'success', summary: 'Customer added to order.', detail: '' });
    this.router.navigate([`/admin/dashboard/create-order/products`]);
    // this.doneSelectingCustomer.emit(item);
  }
  add() {
    this.router.navigate(['admin/dashboard/customer', 'add', `_admin_dashboard_create-order_customer`]);
  }

  edit(customer: User) {
    if (customer)
      this.router.navigate(['admin/dashboard/customer', customer.UserId, `_admin_dashboard_create-order_customer`]);
  }


  gotoProducts() {
    if (!this.order.Customer) {
      this.messageService.add({ severity: 'error', summary: 'Please choose or create a customer', detail: '' });

      return;
    }
    this.router.navigate(['/admin/dashboard/create-order/products'])
  }
  cancel() {
    this.orderService.updateOrderState(null);
    this.router.navigate(['/admin/dashboard'])
  }
}
