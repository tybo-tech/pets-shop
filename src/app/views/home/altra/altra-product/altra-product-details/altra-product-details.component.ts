import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order, Orderproduct, Product } from 'src/models';
import { OrderService } from 'src/services';
import { COMPANY, ORDER_TYPE_SALES } from 'src/shared/constants';

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
  showCart: any;

  constructor(
    private orderService: OrderService,
    private router: Router,

    @Inject(DOCUMENT) private _document: HTMLDocument

  ) {


  }

  ngOnInit(): void {
    this.orderService.OrderObservable.subscribe(data => {
      this.order = data;
      this.carttItems = 0;
      if (this.order && this.order.Orderproducts)
        this.carttItems = this.order.Orderproducts.length
    })
  }
  addToCart(product: Product) {
    if (!this.order)
      this.initOrder();

    if (!this.order.Orderproducts)
      this.order.Orderproducts = [];

    if (this.order && this.order.Orderproducts.length) {
      if (this.order.CompanyId !== product.CompanyId) {
        return false;
      }

    }

    if (product && product.ProductId) {
      product.SelectedQuantiy = this.selectedQuantiy;
      const orderproduct = this.mapOrderproduct(product);
      this.order.Orderproducts.push(orderproduct);
      if (product.Company) {
        this.order.Company = product.Company;
      }
      this.order.CompanyId = product.CompanyId;
      this.calculateTotalOverdue();
      this.order.Total = this.Total;
      this.orderService.updateOrderState(this.order);
      this.modalHeading = `${product.Name} added to bag successfully`;
      // this.cart();
      this.showCartEvent();
    }
  }

  mapOrderproduct(product: Product): Orderproduct {
    return {
      Id: '',
      OrderId: '',
      ProductId: product.ProductId,
      CompanyId: product.CompanyId,
      ProductName: product.Name,
      ProductType: 'Product',
      Colour: product.SelectedCoulor || '',
      Size: product.SelectedSize || '',
      Quantity: product.SelectedQuantiy || 1,
      SubTotal: product.SelectedQuantiy * Number(product.RegularPrice),
      UnitPrice: product.SalePrice || product.RegularPrice,
      FeaturedImageUrl: product.FeaturedImageUrl,
      CreateUserId: '',
      ModifyUserId: '',
      StatusId: 1
    };
  }

  calculateTotalOverdue() {
    this.Total = 0;
    this.order.Orderproducts.forEach(line => {
      this.Total += (Number(line.UnitPrice) * Number(line.Quantity));
    });

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

  initOrder() {
    this.order = this.orderService.currentOrderValue;
    if (!this.order) {
      this.order = {
        OrdersId: '',
        OrderNo: 'Shop',
        CompanyId: COMPANY,
        CustomerId: '',
        AddressId: '',
        Notes: '',
        Shipping: '',
        OrderType: ORDER_TYPE_SALES,
        Total: 0,
        Paid: 0,
        Due: 0,
        InvoiceDate: new Date(),
        DueDate: '',
        CreateUserId: 'shop',
        ModifyUserId: 'shop',
        Status: 'Not paid',
        StatusId: 1,
        Orderproducts: []
      }
      this.orderService.updateOrderState(this.order);
    }

  }

}
