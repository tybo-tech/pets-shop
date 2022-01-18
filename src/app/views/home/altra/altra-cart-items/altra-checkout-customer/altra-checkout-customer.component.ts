import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Order, User } from 'src/models';
import { Item, ITEM_CUSTOMER_ADRESS } from 'src/models/item.model';
import { LocationModel } from 'src/models/UxModel.model';
import { AccountService, OrderService, UserService } from 'src/services';
import { ItemService } from 'src/services/item.service';
import { COMPANY, ITEM_TYPES, LOCATION_TYPES, ORDER_STATUS, USER_TYPES } from 'src/shared/constants';

@Component({
  selector: 'app-altra-checkout-customer',
  templateUrl: './altra-checkout-customer.component.html',
  styleUrls: ['./altra-checkout-customer.component.scss']
})
export class AltraCheckoutCustomerComponent implements OnInit {
  user: User;
  customer: User;
  userExist: boolean;
  viewing: boolean;
  editing: boolean;
  order: Order;
  customerAddress: Item;
  selectingAddress: boolean;
  editingAddress: boolean;
  customerAddressItem: Item;
  LOCATION_TYPES = LOCATION_TYPES;
  orderDelivery: Item;
  backLabel: string;
  constructor(
    private accountService: AccountService,
    private orderService: OrderService,
    private userService: UserService,
    private messageService: MessageService,
    private itemService: ItemService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.backLabel = `<i class='fas fa-arrow-left'></i> Back to cart`;
    this.orderService.OrderObservable.subscribe(data => {
      this.order = data;
    })
    this.accountService.user.subscribe(data => {
      this.user = data;
      if (this.user && this.user.UserType === USER_TYPES.CUSTOMER.Name) {
        this.linkUserToOrder();
        this.viewing = true;
      } else {
        this.initCustomer();
      }
    });


    this.itemService.ItemListObservable.subscribe(data => {
      if (data && data.length) {
        this.orderDelivery = data.find(x => x.ItemType === ITEM_TYPES.ORDER_DELIVERY.Name);
      }
    })
  }


  //***********************  END  *******************************/
  initCustomer() {
    this.customer = {
      UserId: '',
      CompanyId: COMPANY,
      UserType: 'Customer',
      Name: '',
      Surname: '',
      Email: '',
      PhoneNumber: '',
      Password: 'notset',
      Dp: '',
      AddressLineHome: '',
      AddressUrlHome: '',
      AddressLineWork: '',
      AddressUrlWork: '',
      CreateUserId: `CHECKOUTPAGE`,
      ModifyUserId: `CHECKOUTPAGE`,
      StatusId: '1',
      UserToken: '',
      Items: []
    };
  }

  linkUserToOrder() {
    this.customer = this.user;
    if (this.order) {
      this.order.Customer = this.customer;

      if (!this.customer.Items || !this.customer.Items.length) {
        this.order.AddressId = ''
        this.order.LocationName = '';
        this.order.AddressLine = '';
        this.order.LocationNumber = '';
        this.order.Latitude = 0;
        this.order.Longitude = 0;
      }



      if (this.customer.Items && this.customer.Items.length && !this.order.AddressId) {
        this.order.AddressId = this.customer.Items[0].ItemId
        this.order.LocationName = this.customer.Items[0].Name;
        this.order.AddressLine = this.customer.Items[0].AddressLine;
        this.order.LocationNumber = this.customer.Items[0].LocationNumber;
        this.order.Latitude = this.customer.Items[0].Latitude;
        this.order.Longitude = this.customer.Items[0].Longitude;
      }
      this.orderService.updateOrderState(this.order);
    }
  }

  save() {

    if (this.customer.UserId && this.customer.UserId.length > 5) {
      this.userService.updateUserSync(this.customer).subscribe(data => {
        if (data && data.UserId) {
          this.accountService.updateUserState(data);
          this.messageService.add({ severity: 'success', summary: 'Customer info updated', detail: `` });

        }
      })
    }
    else {

      this.userService.add(this.customer).subscribe(data => {
        if (data && data.UserId) {
          this.accountService.updateUserState(data);
          this.messageService.add({ severity: 'success', summary: 'Customer info created', detail: `` });
        }
      });
    }
  }




  checkEmail() {
    this.userExist = false;
    if (!this.customer)
      return
    this.userService.getUserSync(this.customer.Email).subscribe(data => {
      if (data && data.UserId) {
        this.userExist = true;
      }
    })
  }
  adressChanged() {
    this.selectingAddress = false;
    if (!this.order.AddressId)
      return;

    const adress = this.user.Items.find(x => x.ItemId === this.order.AddressId);
    if (!adress)
      return

    this.order.LocationNumber = adress.LocationNumber;
    this.order.AddressLine = adress.AddressLine;
    this.order.Latitude = adress.Latitude;
    this.order.Longitude = adress.Longitude;
    this.order.LocationName = adress.Name;
    this.orderService.deliveryMethodChanged(this.order, this.orderDelivery);
    this.orderService.updateOrderState(this.order);
    this.messageService.add({ severity: 'success', summary: 'Address updated', detail: `Your items will be delivered at ${this.order.LocationName}` });

  }

  editAddress() {
    this.customerAddressItem = this.customer.Items.find(x => x.ItemId === this.order.AddressId);
    if (!this.customerAddressItem)
      return;
    this.editingAddress = true;

  }

  saveItem() {
    if (this.customerAddressItem.CreateDate) {
      this.itemService.update(this.customerAddressItem).subscribe(data => {
        if (data && data.ItemId) {
          this.editingAddress = false;
          this.order.AddressId = data.ItemId;
          this.adressChanged();
          this.accountService.updateUserState(this.user);
          this.messageService.add({ severity: 'success', summary: 'Address updated successfully.', detail: `` });
        }
      })
    } else {
      this.customerAddressItem.ParentId = this.user.UserId;
      this.itemService.add(this.customerAddressItem).subscribe(data => {
        if (data && data.ItemId) {
          this.editingAddress = false;
          this.order.AddressId = data.ItemId;
          if (!this.user.Items)
            this.user.Items = [];

          this.user.Items.push(data);
          this.accountService.updateUserState(this.user);
          this.adressChanged();
          this.messageService.add({ severity: 'success', summary: 'Address created successfully.', detail: `` });
        }
      })
    }

  }
  onAdressEvent(event: LocationModel) {
    if (event) {
      this.order.Latitude = event.lat;
      this.order.Longitude = event.lng;
      this.order.AddressLine = event.addressLine;
      this.order = this.orderService.deliveryMethodChanged(this.order, this.orderDelivery);
      this.orderService.updateOrderState(this.order);
    }
  }
  addNewAddress() {
    this.customerAddressItem = ITEM_CUSTOMER_ADRESS;
    this.editingAddress = true;
  }
  shipping() {

    if (!this.order.OrdersId) {
      this.order.Status = ORDER_STATUS.DRAFT.Name;
      this.orderService.create(this.order).subscribe(data => {
        if (data && data.OrdersId) {
          this.order = data;
          this.orderService.updateOrderState(this.order);
          this.router.navigate([`/shopping/checkout/${this.order.OrdersId}/shipping`]);
        }
      })
    }
  }
  cart() {
    this.orderService.updateOrderState(this.order);
    this.router.navigate(['/view-cart']);
  }
}
