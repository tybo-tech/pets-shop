import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User } from 'src/models';
import { Item, ITEM_COLLECTIONS, ITEM_CUSTOMER_ADRESS } from 'src/models/item.model';
import { LocationModel } from 'src/models/UxModel.model';
import { AccountService, UserService } from 'src/services';
import { ItemService } from 'src/services/item.service';
import { COMPANY, ITEM_TYPES, LOCATION_TYPES } from 'src/shared/constants';

@Component({
  selector: 'app-altra-customer-address',
  templateUrl: './altra-customer-address.component.html',
  styleUrls: ['./altra-customer-address.component.scss']
})
export class AltraCustomerAddressComponent implements OnInit {
  customerAddressItem: Item;
  items: Item[];
  item: Item;
  message: string;
  heading = 'Add address'
  ITEM_TYPES = ITEM_TYPES;
  LOCATION_TYPES = LOCATION_TYPES;
  editing: boolean;
  user: User;
  constructor(
    private itemService: ItemService,
    private accountService: AccountService,
    private messageService: MessageService,
    private userService: UserService,
    private router: Router) { }

  ngOnInit(): void {
    this.accountService.user.subscribe(data => {
      this.user = data;
      this.getItems();
    })
  }
  getItems() {
    if (this.user && this.user.Items) {
      this.items = this.user.Items;
      this.editing = false;
      if (this.items)
        this.customerAddressItem = this.items.find(x => x.ItemType === ITEM_TYPES.CUSTOMER_ADRESS.Name) || ITEM_CUSTOMER_ADRESS;
    }

  }
  save(isDelete = false) {
    if (this.item && this.item.ItemType === ITEM_TYPES.ORDER_COLLECTIONS.Name && this.item.DescriptionJson) {
      this.item.Description = JSON.stringify(this.item.DescriptionJson);
    }
    this.item.ParentId = this.user.UserId;
    if (this.item.CreateDate) {
      this.itemService.update(this.item).subscribe(data => {
        if (data && data.ItemId) {
          this.message = 'Address updated successfully.';
          if (isDelete)
            this.showSuccess('', 'Address Deleted', 'error');
          else
            this.showSuccess(this.message);

          // this.getItems();
          this.getUser();
          this.item = null;

        }
      });

      if (isDelete) {
        this.getUser();
        this.showSuccess('', 'Address Deleted', 'error');
      }
    } else {
      this.itemService.add(this.item).subscribe(data => {
        if (data && data.ItemId) {
          this.message = 'Address created successfully.';
          this.showSuccess(this.message);
          this.getItems();
          this.getUser();
          this.item = null;
        }
      })
    }

  }
  onAdressEvent(event: LocationModel) {
    console.log(event);
    if (event) {
      this.customerAddressItem.Latitude = event.lat;
      this.customerAddressItem.Longitude = event.lng;
      this.customerAddressItem.AddressLine = event.addressLine;
    }
  }
  getUser() {
    this.userService.getUserSync(this.user.UserId).subscribe(data => {
      if (data && data.UserId)
        this.accountService.updateUserState(data);
    });
  }


  add() {
    this.customerAddressItem = ITEM_CUSTOMER_ADRESS;
    this.editing = true;
  }

  showSuccess(detail, summary = 'Success', severity = 'success') {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
  }
}
