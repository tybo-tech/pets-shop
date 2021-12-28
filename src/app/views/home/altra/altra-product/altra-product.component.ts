import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/models';

@Component({
  selector: 'app-altra-product',
  templateUrl: './altra-product.component.html',
  styleUrls: ['./altra-product.component.scss']
})
export class AltraProductComponent implements OnInit {
@Input() product: Product;
  constructor() { }

  ngOnInit(): void {
  }

}
