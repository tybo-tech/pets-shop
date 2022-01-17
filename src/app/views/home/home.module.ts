import { NgModule } from '@angular/core';
import { HomeRoutingModule, declarations } from './home-routing.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MenubarModule} from 'primeng/menubar';
import { AltraCheckoutComponent } from './altra/altra-cart-items/altra-checkout/altra-checkout.component';
import { AltraCheckoutCustomerComponent } from './altra/altra-cart-items/altra-checkout-customer/altra-checkout-customer.component';
import { AltraCustomerAddressComponent } from './altra/customer/altra-customer-address/altra-customer-address.component';
import {ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AltraBreadcrumbComponent } from './altra/shared/altra-breadcrumb/altra-breadcrumb.component';
import { AltraPaymentsComponent } from './altra/altra-cart-items/altra-payments/altra-payments.component';
import { AltraCartPageComponent } from './altra/altra-cart-items/altra-cart-page/altra-cart-page.component';
import { AltraPhoneNavComponent } from './altra/altra-nav/altra-phone-nav/altra-phone-nav.component';
import { AltraPaymentMethodsComponent } from './altra/altra-payment-methods/altra-payment-methods.component';
import { AltraProductComponent } from './altra/altra-product/altra-product.component';
import { AltraProductDetailsComponent } from './altra/altra-product/altra-product-details/altra-product-details.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    GooglePlaceModule,
    HomeRoutingModule,
    MatSnackBarModule,
    MatIconModule,
    MatTabsModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    ClipboardModule,
    MenubarModule,
    ToastModule


    // QuillModule.forRoot()

  ],
  providers: [MessageService],
  declarations: [...declarations, AltraCheckoutComponent, AltraCheckoutCustomerComponent, AltraCustomerAddressComponent, AltraBreadcrumbComponent, AltraPaymentsComponent, AltraCartPageComponent, AltraPhoneNavComponent, AltraPaymentMethodsComponent, AltraProductComponent, AltraProductDetailsComponent]
})
export class HomeModule { }


