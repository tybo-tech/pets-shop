import { Component, OnInit } from '@angular/core';
import { Order } from 'src/models';
import { Item } from 'src/models/item.model';
import { OrderService } from 'src/services';
import { ItemService } from 'src/services/item.service';
import { ITEM_TYPES } from 'src/shared/constants';
import { DictionaryModel, initNavTheme } from 'src/shared/ngstyle.model';

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
    order: Order;
    primaryNavStyles: DictionaryModel[] = initNavTheme;
    secondaryNavigationStyles: DictionaryModel[] = initNavTheme;
    searchBoxStyles: DictionaryModel[] = initNavTheme;

    primaryNgStyle = {};
    secondaryNgStyle = {};
    searchBoxNgStyle = {};

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
            if (this.navBarTheme) {
                this.navClass = this.navBarTheme.Description;
                this.formatDataOnLoad();
            }
        })
    }

    formatDataOnLoad() {
        // Nan Theme
        if (this.navBarTheme.Name && this.navBarTheme.Name.length > 15) {
            this.primaryNavStyles = JSON.parse(this.navBarTheme.Name);
        }

        if (this.navBarTheme.Description && this.navBarTheme.Description.length > 15) {
            this.secondaryNavigationStyles = JSON.parse(this.navBarTheme.Description);
        }

        
        if (this.navBarTheme.AddressLine && this.navBarTheme.AddressLine.length > 15) {
            this.searchBoxStyles = JSON.parse(this.navBarTheme.AddressLine);
        }

        this.primaryNavStyles.forEach(item => {
            this.primaryNgStyle[item.Key] = item.Value
        });

 
        this.secondaryNavigationStyles.forEach(item => {
            this.secondaryNgStyle[item.Key] = item.Value
        });

        this.searchBoxStyles.forEach(item => {
            this.searchBoxNgStyle[item.Key] = item.Value
        });

    }

}
