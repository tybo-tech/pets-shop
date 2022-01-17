import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Order, User } from 'src/models';
import { Item } from 'src/models/item.model';
import { ItemService } from 'src/services/item.service';
import { ITEM_TYPES } from 'src/shared/constants';

@Component({
  selector: 'app-altra-payments',
  templateUrl: './altra-payments.component.html',
  styleUrls: ['./altra-payments.component.scss']
})
export class AltraPaymentsComponent implements OnInit {
  @Input() user: User;
  @Input() order: Order;
  companyId: string;
  shopingSuccesfulUrl: string;
  paymentCancelledUrl: string;
  paymentCallbackUrl: string;
  productName: string;
  productDescription: any;
  merchantId = '';
  merchantKey = '';
  payFast: Item;
  backLabel: string;

  constructor(private router: Router, private itemService: ItemService) { }

  ngOnInit(): void {
    this.backLabel = `<i class="fas fa-arrow-left"></i> Back to shipping`
    this.companyId = this.order.CompanyId;
    this.shopingSuccesfulUrl = `${environment.BASE_URL}/home/shopping-succesful/${this.companyId}`;
    this.paymentCancelledUrl = `${environment.BASE_URL}/home/payment-cancelled/${this.companyId}`;
    this.paymentCallbackUrl = `${environment.BASE_URL}/home/payment-callback`;
    this.productName = this.order.Orderproducts.map(x => x.ProductName).toString();
    this.productDescription = this.productName;

    if (this.productName.length > 100) {
      this.productName = this.productName.substring(0, 99);
    }
    if (this.productDescription.length > 255) {
      this.productDescription = this.productDescription.substring(0, 254);
    }

    this.itemService.ItemListObservable.subscribe(data => {
      if (data && data.length)
        this.payFast = data.find(x => x.ItemType === ITEM_TYPES.PAYFAST.Name);
      if (this.payFast)
        this.merchantId = this.payFast.Name;
      this.merchantKey = this.payFast.Description;

    })
  }
  backtoInfo() {
    this.router.navigate(['/shopping/checkout/add/shipping'])
  }
}
