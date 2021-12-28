import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Order, User } from 'src/models';
import { Item, OPARATING_HOURS } from 'src/models/item.model';
import { LocationModel } from 'src/models/UxModel.model';
import { OrderService } from 'src/services';
import { ItemService } from 'src/services/item.service';
import { UxService } from 'src/services/ux.service';
import { ITEM_TYPES } from 'src/shared/constants';

@Component({
  selector: 'app-altra-delivery',
  templateUrl: './altra-delivery.component.html',
  styleUrls: ['./altra-delivery.component.scss']
})
export class AltraDeliveryComponent implements OnInit {
  @Input() user: User;
  ITEM_TYPES = ITEM_TYPES;
  order: Order;
  orderCollection: Item;
  orderDelivery: Item;
  constructor(
    private orderService: OrderService,
    private itemService: ItemService,
    private uxService: UxService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.orderService.OrderObservable.subscribe(data => {
      this.order = data;
    });


    this.itemService.ItemListObservable.subscribe(data => {
      if (data && data.length) {
        this.orderCollection = data.find(x => x.ItemType === ITEM_TYPES.ORDER_COLLECTIONS.Name);
        this.orderDelivery = data.find(x => x.ItemType === ITEM_TYPES.ORDER_DELIVERY.Name);
        if (this.orderCollection.Description)
          this.orderCollection.DescriptionJson = JSON.parse(this.orderCollection.Description);
        else
          this.orderCollection.DescriptionJson = OPARATING_HOURS;
      }


    })
  }
  orderChanged() {
    this.orderService.updateOrderState(this.order);
  }

  deliveryMethodChanged() {
    this.orderService.deliveryMethodChanged(this.order, this.orderDelivery);
    return;
  }


  calucalateDistance(toLocation: LocationModel) {
    // From Company to any location
    const cord1: LocationModel = {
      lat: this.orderDelivery.Latitude,
      lng: this.orderDelivery.Longitude,
      addressLine: ``,
      url: ``
    }

    const distance = this.uxService.calcCrow(cord1, toLocation);

    return Math.ceil(distance);
  }

  gotoPayments() {
    if(!this.order.Shipping)
    {
      this.messageService.add({ severity: 'error', summary: 'Please choose delivery or branch collection', detail: '' });

      return;
    }
    this.router.navigate(['/shopping/checkout/add/payments'])
  }
  gotoInfo() {
    this.router.navigate(['/shopping/checkout/add/information'])
  }
}
