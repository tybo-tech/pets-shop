import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, Orderproduct, User } from 'src/models';
import { Shipping } from 'src/models/shipping.model';
import { AccountService, UserService } from 'src/services';
import { OrderService } from 'src/services/order.service';
import { Location } from '@angular/common';
import { UxService } from 'src/services/ux.service';
import { PromotionService } from 'src/services/promotion.service';
import { COMPANY, COMPANY_TYPE, DISCOUNT_TYPES } from 'src/shared/constants';
import { LocationModel } from 'src/models/UxModel.model';
import { CompanyService } from 'src/services/company.service';
import { Company } from 'src/models/company.model';

@Component({
  selector: 'app-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.scss']
})
export class CartItemsComponent implements OnInit {
  @Input() order: Order;
  @Input() hideDelete;
  @Input() shippings: Shipping[];
  @Input() Class: string[];
  user: User;
  showAdd;
  promoCode: string;
  discountAmount: number;
  company: Company;
  showAddAddress: boolean;

  constructor(
    private router: Router,
    private orderService: OrderService,
    private accountService: AccountService,
    private location: Location,
    private uxService: UxService,
    private companyService: CompanyService,
    private promotionService: PromotionService,
    private userService: UserService,

  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
 

    this.companyService.getCompanyById(COMPANY).subscribe(data => {
      this.company = data;
      if (this.shippings && this.shippings.length) {
        this.calculateTotalShipping();
      }
    })
  }
  back() {
    this.location.back();
  }

  deleteItem(item: Orderproduct, i) {
    this.order.Total -= (Number(item.UnitPrice) * Number(item.Quantity));
    this.order.Orderproducts.splice(i, 1);
    if (this.order.Orderproducts.length === 0) {
      this.order = null;
    }
    this.orderService.updateOrderState(this.order);
    this.order = this.orderService.currentOrderValue;
  }
  selectShipping(shipping: Shipping) {
    if (shipping) {
      this.shippings.map(x => x.Selected = false);
      shipping.Selected = true;
      this.order.ShippingPrice = shipping.Price;
      this.order.Shipping = shipping.Name;
      this.calculateTotalOverdue();
      this.order.Total = Number(this.order.Total) + Number(shipping.Price);
      this.orderService.updateOrderState(this.order);
      this.showAdd = false;
    }
  }

  calculateTotalOverdue() {
    this.order.Total = 0;
    this.discountAmount = 0;
    this.order.Orderproducts.forEach(line => {
      if (line.DiscountPrice && this.order.Discount) {
        this.order.Total += (Number(line.DiscountPrice) * Number(line.Quantity));
        this.discountAmount +=
          (
            (Number(line.UnitPrice) * Number(line.Quantity)) - (Number(line.DiscountPrice) * Number(line.Quantity))
          );
        this.promoCode = this.order.Discount.PromoCode
      } else {

        this.order.Total += (Number(line.UnitPrice) * Number(line.Quantity));
      }
    });

  }
  profile() {
    this.uxService.keepNavHistory({
      BackToAfterLogin: '/shop/checkout',
      BackTo: null,
      ScrollToProduct: null,
    });
    this.router.navigate(['home/edit-myprofile'])
  }

  updateOrder() {
    this.orderService.updateOrderState(this.order);
  }
  promoChanged() {
    if (this.promoCode) {
      if (this.order.Discount) {
        return;
      }
      this.promotionService.getByCode(this.promoCode).subscribe(data => {
        if (data && data.PromotionId) {
          if (data.PromoType === DISCOUNT_TYPES[0]) {
            // % off
            this.order.Orderproducts.forEach(line => {
              // line.UnitPrice = Number(line.UnitPrice) - (line.UnitPrice * (Number(data.DiscountValue) / 100));
              line.DiscountPrice = Number(line.UnitPrice) - (line.UnitPrice * (Number(data.DiscountValue) / 100));
            });
            this.order.Discount = data;
            this.calculateTotalOverdue();
          }
          if (data.PromoType === DISCOUNT_TYPES[1]) {
            this.order.Orderproducts.forEach(line => {
              // line.UnitPrice = Number(line.UnitPrice) - Number(data.DiscountValue);
              line.DiscountPrice = Number(line.UnitPrice) - Number(data.DiscountValue);
            });
            this.order.Discount = data;
            this.calculateTotalOverdue();

          }

          // shipping 

          this.calculateTotalShipping();



        }
      })
    }
  }

  removePromo() {
    this.order.Orderproducts.forEach(line => {
      line.DiscountPrice = undefined;
      this.order.Discount = undefined;
    });

    this.calculateTotalOverdue();
    this.calculateTotalShipping();
  }

  calculateTotalShipping() {
    // if (this.order.Total < 1000) {
    //   const courier = this.shippings.find(x => x.ShippingId === 'courier');
    //   if (courier) {
    //     this.selectShipping(courier);
    //   }
    // }

    const courier = this.shippings.find(x => x.ShippingId === 'courier');
    if (courier) {
      courier.Price =  this.calucalateShipping();
      this.selectShipping(courier);
    }


    // if (this.order.Total >= 1000) {
    //   const courier = {
    //     ShippingId: 'free',
    //     CompanyId: '',
    //     Name: 'Free delivery',
    //     Description: '',
    //     Price: 0,
    //     ImageUrl: '',
    //     CreateUserId: undefined,
    //     ModifyUserId: undefined,
    //     StatusId: 1
    //   }
    //   if (courier) {
    //     this.selectShipping(courier);
    //   }
    // }


    // else {
    //   if (this.order.Shipping && this.order.ShippingPrice) {
    //     this.order.Total = Number(this.order.Total) + Number(this.order.ShippingPrice);
    //     this.orderService.updateOrderState(this.order);
    //   }

    // }
  }

  calucalateShipping() {
    const cord1: LocationModel = {
      lat: this.company.Latitude,
      lng: this.company.Longitude,
      addressLine: ``,
      url: ``
    }
    if (!this.user.Latitude || !this.user.Longitude) {
      this.showAddAddress = true;
      return 0;
    }
    const cord2: LocationModel = {
      lat: this.user.Latitude,
      lng: this.user.Longitude,
      addressLine: ``,
      url: ``
    }




    const distance = this.uxService.calcCrow(cord1, cord2);
    const shipping = (Math.ceil(distance) * Number(this.company.DeliveryRate));

    return shipping;
  }

  saveUser() {
    this.user.AddressLineHome = this.user.AddressLineHome || ''
    this.user.AddressUrlHome = this.user.AddressUrlHome || ''
    this.user.AddressLineWork = this.user.AddressLineWork || ''
    this.user.AddressUrlWork = this.user.AddressUrlWork || ''
    if (this.user.UserId && this.user.UserId.length > 5) {
      this.userService.updateUserSync(this.user).subscribe(data => {
        if (data && data.UserId) {
          data.Company = this.user.Company;
          this.accountService.updateUserState(data);
          this.uxService.updateMessagePopState('Profile updated successfully.');
          if (this.shippings && this.shippings.length) {
            this.calculateTotalShipping();
            this.showAddAddress = false;
          }
        }
      })
    }

  }

  onAdressEvent(event: LocationModel) {
    console.log(event);
    if (event) {
      this.user.Latitude = event.lat;
      this.user.Longitude = event.lng;
      this.user.AddressLineHome = event.addressLine;
    }
  }
}


