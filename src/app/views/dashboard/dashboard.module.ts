import { NgModule } from '@angular/core';
import { DashboardRoutingModule, declarations } from './dashboard-routing.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { QuillModule } from 'ngx-quill';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import {MatBadgeModule} from '@angular/material/badge';
import {MatIconModule} from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ImageCropperModule } from 'ngx-image-cropper';
import {ToastModule} from 'primeng/toast';

import {EditorModule} from 'primeng/editor';
import { ConfirmationService, MessageService } from 'primeng/api';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import { SharedModule } from 'src/app/shared/shared.module';
import { AltraLayoutComponent } from './settings/banners/altra-layout/altra-layout.component';
import { PromotionProductsComponent } from './promotion/add-promotion/promotion-products/promotion-products.component';
import { AltraNgStyleComponent } from './settings/banners/altra-ng-style/altra-ng-style.component';
import { CompanyContactsComponent } from './settings/banners/vat/company-contacts/company-contacts.component';

@NgModule({
  imports: [
    SharedModule,
    MatNativeDateModule,
    DashboardRoutingModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatRadioModule,
    MatAutocompleteModule,
    // MaterialModule,
    MatSnackBarModule,
    MatChipsModule,
    MatBadgeModule,
    MatIconModule,
    MatProgressSpinnerModule,
    GooglePlaceModule,
    ClipboardModule,
    MatSlideToggleModule,
    ImageCropperModule,
    EditorModule,
    QuillModule.forRoot(),
    ToastModule,
    ConfirmPopupModule

  ],
  declarations: [...declarations, AltraLayoutComponent, PromotionProductsComponent, AltraNgStyleComponent, CompanyContactsComponent],
  providers: [MessageService, ConfirmationService],

})
export class DashboardModule { }
