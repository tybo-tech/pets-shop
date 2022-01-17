import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from 'src/models';

@Component({
  selector: 'app-altra-product',
  templateUrl: './altra-product.component.html',
  styleUrls: ['./altra-product.component.scss'],
  animations: [
    trigger('popOverState', [
      state('show', style({
        opacity: 1
      })),

      state('hide', style({
        opacity: 0
      })),

      transition('show => hide', animate('600ms ease-out')),
      transition('hide => show', animate('600ms ease-in')),
    ])
  ]
})
export class AltraProductComponent implements OnInit {
  @Input() product: Product;
  @Output() addToCartEvent: EventEmitter<Product> = new EventEmitter();
  addToCartLabel: string;

  constructor() { }

  ngOnInit(): void {
    this.addToCartLabel = '<i class="fas fa-shopping-cart for-pc"></i> Add to cart'

  }
  addToCart(product: Product) {
    this.addToCartEvent.emit(product);
  }
}
