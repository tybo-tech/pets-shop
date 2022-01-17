import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, Product } from 'src/models';
import { OrderService } from 'src/services';

@Component({
  selector: 'app-altra-product-details',
  templateUrl: './altra-product-details.component.html',
  styleUrls: ['./altra-product-details.component.scss']
})
export class AltraProductDetailsComponent implements OnInit {
  @Input() product: Product;
  @Input() productId: any;
  order: Order;
  carttItems: number;
  selectedQuantiy: number;
  Total: number;
  modalHeading: string;
  addToCartLabel: `<i class="fas fa-shopping-cart for-pc"></i> Add to cart`;
  showCart: any;

  constructor(
    private orderService: OrderService,
    private router: Router,

    @Inject(DOCUMENT) private _document: HTMLDocument

  ) {


  }

  ngOnInit(): void {
    this.addToCartLabel = '<i class="fas fa-shopping-cart for-pc"></i> Add to cart'
    this.orderService.OrderObservable.subscribe(data => {
      this.order = data;
      this.carttItems = 0;
      if (this.order && this.order.Orderproducts)
        this.carttItems = this.order.Orderproducts.length
    })
  }
  addToCart(product: Product) {

    if (product && product.ProductId) {
      this.order = this.orderService.addToCart(product, this.order);
      this.orderService.updateOrderState(this.order);
      this.modalHeading = `${product.Name} added to bag successfully`;
      // this.cart();
      this.showCartEvent();
    }
  }

  like() {

  }
  checkout() {
    this.showCartEvent();
    this.router.navigate([`shopping/checkout/${this.order.OrdersId || 'add'}/information`])
  }
  shopMore() {
    this.showCartEvent();
    this.router.navigate([`products`])
  }


  showCartEvent() {
    this.showCart = !this.showCart;
    if (this.showCart) {
      var body = this._document.getElementById('_body');
      if (body)
        body.style.overflow = 'hidden'

    }

    if (!this.showCart) {
      var body = this._document.getElementById('_body');
      if (body)
        body.style.overflowY = 'scroll'
    }
  }
  viewMore(product: Product) {
    this.router.navigate(['/products', product.ProductSlug])
  }

}
