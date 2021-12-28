import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, User } from 'src/models';
import { AccountService, OrderService } from 'src/services';
import { ItemService } from 'src/services/item.service';
import { ITEM_TYPES } from 'src/shared/constants';

@Component({
    selector: 'app-altra-account-nav',
    templateUrl: 'altra-account-nav.component.html',
    styleUrls: ['altra-account-nav.component.scss']
})
export class AltraAccountNavComponent implements OnInit {
    user: User;
    navBarTheme: any;
    navClass: any;
    likes = 0;
    order: Order;
    showCart: boolean;
    @Input() carttItems;
    showUserProfileModal: boolean;
    constructor(
        private accountService: AccountService,
        private itemService: ItemService,
        private orderService: OrderService,
        private router: Router,
        @Inject(DOCUMENT) private _document: HTMLDocument
    ) {

    }
    ngOnInit(): void {
        this.accountService.user.subscribe(data => {
            this.user = data;
            if (this.user) {
                this.user.Dp = this.user.Name;
                const dpArray = this.user.Name.split(' ');
                if (!dpArray.length && this.user.Name.length > 1)
                    this.user.Dp = `${this.user.Name[0]}${this.user.Name[1]}`

                if (dpArray.length > 1 && this.user.Name.length > 1)
                    this.user.Dp = `${dpArray[0][0]}${dpArray[1][0]}`
            }
        });

        this.itemService.ItemListObservable.subscribe(data => {
            if (data && data.length)
                this.navBarTheme = data.find(x => x.ItemType === ITEM_TYPES.NAV_BARTHEME.Name);
            if (this.navBarTheme)
                this.navClass = this.navBarTheme.Description;

        })

        this.orderService.OrderObservable.subscribe(data => {
            this.order = data;
        })

        // this.showCartEvent();
    }

    logout() {
        this.accountService.logout();
    }

    showCartEvent() {
        this.showCart = !this.showCart;
        if (this.showCart) {
            var body = this._document.getElementById('_body');
            if (body)
                body.style.overflowY = 'hidden'

        }


        if (!this.showCart) {
            var body = this._document.getElementById('_body');
            if (body)
                body.style.overflowY = 'scroll'

        }
    }

    checkout() {
        this.showCartEvent();
        this.router.navigate([`shopping/checkout/${this.order.OrdersId || 'add'}/information`])
    }
}



