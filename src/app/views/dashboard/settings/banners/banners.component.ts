import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models';
import { item, Item, ITEM_ABOUT_US, ITEM_COLLECTIONS, ITEM_DELIVERY, ITEM_NAVBARTHEME, ITEM_PAYFAST, ITEM_TITLE, OPARATING_HOURS } from 'src/models/item.model';
import { LocationModel } from 'src/models/UxModel.model';
import { AccountService } from 'src/services';
import { ItemService } from 'src/services/item.service';
import { ADMIN, CUSTOMER, ITEM_TYPES, COMPANY, DELIVERY_RATES } from 'src/shared/constants';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss']
})
export class BannersComponent implements OnInit {



  items: Item[] = [];
  ADMIN = ADMIN;
  CUSTOMER = CUSTOMER;
  user: User;
  searchString: string;

  item: Item;
  websiteLogo: Item;

  banner1: Item;
  banner2: Item;
  banner3: Item;
  banner4: Item;

  aboutUs: Item;
  navBarTheme: Item;
  webTitle: Item;
  payFast: Item;
  orderCollection: Item;
  aboutUsImage: Item;

  homepageBanners: Item[] = [];
  message: string;
  heading: string;
  ITEM_TYPES = ITEM_TYPES;
  DELIVERY_RATES = DELIVERY_RATES;
  selectedItemType: any;
  orderDelivery: Item;
  constructor(
    private itemService: ItemService,
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
  add(itemType) {
    this.item = {
      ItemId: '',
      RelatedId: '',
      RelatedParentId: '',
      Name: itemType,
      ParentId: '',
      ItemType: itemType,
      CompanyId: COMPANY,
      Description: '',
      OrderingNo: 1,
      Price: 0,
      LimitValue: 0,
      OffLimitPrice: 0,
      ItemStatus: 'Active',
      ItemCode: '',
      ImageUrl: '',
      ItemPin: '',
      ItemCategory: ITEM_TYPES.SETTINGS.Name,
      ItemSubCategory: '',
      CreateUserId: '',
      ModifyUserId: '',
      StatusId: 1
    }
    this.heading = `Add ${itemType}`;
    this.selectedItemType = itemType
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
    this.itemService.getItems(COMPANY, ITEM_TYPES.SETTINGS.Name).subscribe(data => {
      this.items = data || [];
      this.websiteLogo = this.items.find(x => x.ItemType === ITEM_TYPES.LOGO.Name);
      this.banner1 = this.items.find(x => x.ItemType === ITEM_TYPES.BANNER1.Name);
      this.banner2 = this.items.find(x => x.ItemType === ITEM_TYPES.BANNER2.Name);
      this.banner3 = this.items.find(x => x.ItemType === ITEM_TYPES.BANNER3.Name);
      this.banner4 = this.items.find(x => x.ItemType === ITEM_TYPES.BANNER4.Name);
      this.banner4 = this.items.find(x => x.ItemType === ITEM_TYPES.BANNER4.Name);
      this.aboutUsImage = this.items.find(x => x.ItemType === ITEM_TYPES.ABOUT_IMAGE.Name);
      this.aboutUs = this.items.find(x => x.ItemType === ITEM_TYPES.ABOUT.Name) || ITEM_ABOUT_US;
      this.navBarTheme = this.items.find(x => x.ItemType === ITEM_TYPES.NAV_BARTHEME.Name) || ITEM_NAVBARTHEME;
      this.webTitle = this.items.find(x => x.ItemType === ITEM_TYPES.TITLE.Name) || ITEM_TITLE;
      this.payFast = this.items.find(x => x.ItemType === ITEM_TYPES.PAYFAST.Name) || ITEM_PAYFAST;
      this.homepageBanners = this.items.filter(x => x.ItemType === ITEM_TYPES.BANNER1.Name);

      this.orderCollection = this.items.find(x => x.ItemType === ITEM_TYPES.ORDER_COLLECTIONS.Name) || ITEM_COLLECTIONS;
      this.orderDelivery = this.items.find(x => x.ItemType === ITEM_TYPES.ORDER_DELIVERY.Name) || ITEM_DELIVERY;
      if (this.orderCollection.Description)
        this.orderCollection.DescriptionJson = JSON.parse(this.orderCollection.Description);
      else
        this.orderCollection.DescriptionJson = OPARATING_HOURS;

    });
  }
  save() {
    if (this.item && this.item.ItemType === ITEM_TYPES.ORDER_COLLECTIONS.Name && this.item.DescriptionJson) {
      this.item.Description = JSON.stringify(this.item.DescriptionJson);
    }
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

  onImageChangedEvent(url, type: string) {
    if (!this.item || !type)
      return;

    this.item.ImageUrl = url;
  }


  onAdressEvent(event: LocationModel) {
    console.log(event);
    if (event) {
      this.orderCollection.Latitude = event.lat;
      this.orderCollection.Longitude = event.lng;
      this.orderCollection.AddressLine = event.addressLine;
    }
  }
  onAdressEvent2(event: LocationModel) {
    console.log(event);
    if (event) {
      this.orderDelivery.Latitude = event.lat;
      this.orderDelivery.Longitude = event.lng;
      this.orderDelivery.AddressLine = event.addressLine;
    }
  }

}
