import { Component, OnInit } from '@angular/core';
import { Item } from 'src/models/item.model';
import { OrderService } from 'src/services';
import { ItemService } from 'src/services/item.service';
import { ITEM_TYPES } from 'src/shared/constants';

@Component({
    selector: 'app-altra-nav',
    templateUrl: 'altra-nav.component.html',
    styleUrls: ['altra-nav.component.scss']
})
export class AltraNavComponent implements OnInit {
    websiteLogo: Item;
    navBarTheme: Item;
    navClass: any;
    carttItems: number;
    order: import("c:/ndu/apps/pets-shop/src/models/order.model").Order;
    constructor(private itemService: ItemService, private orderService: OrderService) { }
    ngOnInit(): void {
        this.orderService.OrderObservable.subscribe(data => {
            this.order = data;
            if (!data || !data.Orderproducts)
                this.carttItems = 0;
            else
                this.carttItems = data.Orderproducts.length;
        });
        this.itemService.ItemListObservable.subscribe(data => {
            if (data && data.length)
                this.websiteLogo = data.find(x => x.ItemType === ITEM_TYPES.LOGO.Name);
            this.navBarTheme = data.find(x => x.ItemType === ITEM_TYPES.NAV_BARTHEME.Name);
            if (this.navBarTheme)
                this.navClass = this.navBarTheme.Description;

        })
    }

}
