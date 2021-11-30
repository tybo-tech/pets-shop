import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models';
import { item, Item } from 'src/models/item.model';
import { AccountService } from 'src/services';
import { ItemService } from 'src/services/item.service';
import { ADMIN, CUSTOMER, COMPANY, ITEM_TYPES } from 'src/shared/constants';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.scss']
})
export class RatesComponent implements OnInit {



  items: Item[] = [];
  ADMIN = ADMIN;
  CUSTOMER = CUSTOMER;
  user: User;
  searchString: string;
  item: Item;
  message: string;
  heading: string;
  constructor(private itemService: ItemService,
    private accountService: AccountService,
    private router: Router,
  ) {
    this.getItems();

  }

  ngOnInit() {
    this.accountService.user.subscribe(data => {
      this.user = data;
    });
  }
  add() {
    this.item = {
      ItemId: '',
      RelatedId: '',
      RelatedParentId: '',
      Name: '',
      ParentId: '',
      ItemType: ITEM_TYPES.RATES.Name,
      CompanyId: COMPANY,
      Description: '',
      OrderingNo: 1,
      Price: 0,
      LimitValue: undefined,
      OffLimitPrice: undefined,
      ItemStatus: 'Active',
      ItemCode: '',
      ImageUrl: '',
      ItemPin: '',
      ItemCategory: ITEM_TYPES.RATES.Name,
      ItemSubCategory: '',
      CreateUserId: '',
      ModifyUserId: '',
      StatusId: 1
    }
    this.heading = 'Add new rate.';
  }
  view(item: Item) {
    this.item = item;
    this.heading = 'Update rate.';
  }
  delete(item: Item) {
    this.item = item;
    this.item.StatusId = 99;
    this.save();

  }

  getItems() {
    this.itemService.getItems(COMPANY, ITEM_TYPES.RATES.Name).subscribe(data => {
      this.items = data || [];
    });
  }
  save() {
    if (this.item.CreateDate) {
      this.itemService.update(this.item).subscribe(data => {
        if (data && data.ItemId) {
          this.message = 'Item updated successfully.';
          this.getItems();
          this.item = null;

        }
      })
    } else {
      this.itemService.add(this.item).subscribe(data => {
        if (data && data.ItemId) {
          this.message = 'Item created successfully.';
          this.getItems();
          this.item = null;
        }
      })
    }

  }
}
