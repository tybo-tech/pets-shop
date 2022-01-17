import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from 'src/models';
import { Customer } from 'src/models/customer.model';
import { UserService } from 'src/services';
import { AccountService } from 'src/services/account.service';
import { CustomerService } from 'src/services/customer.service';
import { CUSTOMER } from 'src/shared/constants';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  showModal: boolean;
  showAddCustomer: boolean;
  showLoader: boolean;
  users: Customer[] = [];
  modalHeading = 'Add customer';
  searchString: string;
  user;
  constructor(
    private accountService: AccountService,
    private userService: UserService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService

  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.userService.userListObservable.subscribe(data => {
      if (data && data.length)
        this.users = data.filter(x => Number(x.StatusId) === 1);
    });
    this.userService.getUsers(this.user.CompanyId, CUSTOMER);
  }
  closeModal() {
    this.showModal = false;
    this.showAddCustomer = false;
  }
  view(user: User) {
    this.userService.updateUserState(user);
    this.router.navigate(['admin/dashboard/customer', user.UserId]);
  }
  delete(user: User) {
    if (!user)
      return;

    user.StatusId = 99;
    this.userService.updateUserSync(user).subscribe(data => {
      this.userService.getUsers(this.user.CompanyId, CUSTOMER);
      this.messageService.add({ severity: 'error', summary: 'Customer deleted.', detail: '' });
    })
  }
  add() {
    this.router.navigate(['admin/dashboard/customer', 'add']);
  }
  back() {
    this.router.navigate(['admin/dashboard']);
  }
  confirm(event: Event, user) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //confirm action
        this.delete(user);
      },
      reject: () => {
        //reject action
      }
    });
  }
}
