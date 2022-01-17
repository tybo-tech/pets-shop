import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AltraCartSammaryComponent } from '../views/home/altra/altra-cart-items/altra-cart-sammary/altra-cart-sammary.component';
import { AltraCartItemsComponent } from '../views/home/altra/altra-cart-items/altra-cart-items.component';
import { AltraCartTotalsComponent } from '../views/home/altra/altra-cart-items/altra-cart-totals/altra-cart-totals.component';
import { AltraDeliveryComponent } from '../views/home/altra/altra-cart-items/altra-delivery/altra-delivery.component';
import { ButtonComponent } from '../button/button.component';
import { LoaderComponent } from '../shared_components';



@NgModule({
  declarations: [
    AltraCartSammaryComponent,
    AltraCartItemsComponent,
    AltraCartTotalsComponent,
    AltraDeliveryComponent,
    ButtonComponent,
    LoaderComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AltraCartSammaryComponent,
    AltraCartItemsComponent,
    AltraCartTotalsComponent,
    AltraDeliveryComponent,
    ButtonComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SharedModule { }
