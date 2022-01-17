import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/services';

@Component({
  selector: 'app-altra-phone-nav',
  templateUrl: './altra-phone-nav.component.html',
  styleUrls: ['./altra-phone-nav.component.scss']
})
export class AltraPhoneNavComponent implements OnInit {
  @Input() navClass;
  @Input() styles;
  @Input() carttItems;
  @Input() websiteLogo;
  @Input() order;
  showCart: boolean;
  showSearch: boolean;
  constructor(
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private router: Router,
    private orderService: OrderService,


  ) { }

  ngOnInit(): void {
    this.orderService.OrderObservable.subscribe(data => {
      this.order = data;
  })

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

  shopMore() {
    this.showCartEvent();
    this.router.navigate([`products`])
  }

}
