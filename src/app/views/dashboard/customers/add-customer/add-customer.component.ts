import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { AddressComponent } from 'ngx-google-places-autocomplete/objects/addressComponent';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { Email, Order, User } from 'src/models';
import { Customer } from 'src/models/customer.model';
import { ModalModel } from 'src/models/modal.model';
import { NavHistoryUX, LocationModel } from 'src/models/UxModel.model';
import { AccountService, EmailService, OrderService, UploadService, UserService } from 'src/services';
import { CustomerService } from 'src/services/customer.service';
import { UxService } from 'src/services/ux.service';
import { CUSTOMER } from 'src/shared/constants';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit {

  loggedInUser: User;
  user: User;
  showLoader;
  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Done',
    routeTo: 'home/profile',
    img: undefined
  };


  address: Address;
  x: AddressComponent;
  navHistory: NavHistoryUX;
  userId: string;
  backTo: string;
  heading: string;
  constructor(
    private uploadService: UploadService,
    private userService: UserService,
    private routeTo: Router,
    private accountService: AccountService,
    private orderService: OrderService,
    private uxService: UxService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,



  ) {

    this.activatedRoute.params.subscribe(r => {
      this.userId = r.id;
      this.backTo = r.backTo;
      this.loggedInUser = this.accountService.currentUserValue;
      if (!this.loggedInUser)
        this.routeTo.navigate(['sign-in'])
      if (this.userId === 'add') {
        this.initNewUser();
      } else {
        userService.getUserSync(this.userId).subscribe(data => {
          if (data && data.UserId) {
            this.user = data;
          } else {
            this.showSuccess('Customer not found.', '', 'error');
            this.back();

          }
        })
      }
    });
  }

  ngOnInit() {

  }
  initNewUser() {
    this.user = {
      UserId: '',
      CompanyId: this.loggedInUser.CompanyId,
      UserType: 'Customer',
      Name: '',
      Surname: '',
      Email: '',
      PhoneNumber: '',
      Password: '',
      Dp: '',
      AddressLineHome: '',
      AddressUrlHome: '',
      AddressLineWork: '',
      AddressUrlWork: '',
      CreateUserId: this.loggedInUser.UserId,
      ModifyUserId: this.loggedInUser.UserId,
      StatusId: '1',
      UserToken: ''
    };
    this.heading = `New customer`;
  }

  back() {
    if (this.backTo) {
      this.backTo = this.backTo.split('_').join('/');
      this.routeTo.navigate([this.backTo]);
      return;
    }
    this.routeTo.navigate(['/admin/dashboard/customers']);
  }


  public uploadFile = (files: FileList) => {
    if (files.length === 0) {
      return;
    }

    Array.from(files).forEach(file => {
      this.uploadService.resizeImage(file, null, this.loggedInUser);
      // const formData = new FormData();
      // formData.append('file', file);
      // formData.append('name', `tybo.${file.name.split('.')[file.name.split('.').length - 1]}`); // file extention
      // this.uploadService.uploadFile(formData).subscribe(url => {
      //   this.user.Dp = `${environment.API_URL}/api/upload/${url}`;
      // });

    });
  }

  save() {
    this.user.AddressLineHome = this.address && this.address.formatted_address || this.user.AddressLineHome;

    this.user.AddressLineHome = this.user.AddressLineHome || ''
    this.user.AddressUrlHome = this.user.AddressUrlHome || ''
    this.user.AddressLineWork = this.user.AddressLineWork || ''
    this.user.AddressUrlWork = this.user.AddressUrlWork || ''
    if (this.user.UserId && this.user.UserId.length > 5) {
      this.showLoader = true;
      this.userService.updateUserSync(this.user).subscribe(data => {
        if (data && data.UserId) {
          this.showLoader = false;
          this.showSuccess('Customer updated successfully.');
          if (this.backTo) {
            this.selectItem(data);
            this.backTo = this.backTo.split('_').join('/');
            this.showSuccess('Customer order updated.');
            this.routeTo.navigate([this.backTo]);
            return;
          }

          // this.back();
        }
      })
    } else {
      this.userService.add(this.user).subscribe(data => {
        if (data && data.UserId) {
          this.showLoader = false;
          this.showSuccess('Customer created successfully.');
          if (this.backTo) {
            this.selectItem(data);
            this.showSuccess('Customer added to order.');
            this.backTo = this.backTo.split('_').join('/');
            this.routeTo.navigate([this.backTo]);
            return;
          }

          // this.back();
        }
      })
    }

  }


  selectItem(item: User) {
    this.orderService.addCustomerToOrder(item);
  }


  handleAddressChange(address: Address) {
    if (address && address.formatted_address) {
      this.address = address;
    }
    this.x = this.getComponentByType(address, "street_number");
  }


  public getComponentByType(address: Address, type: string): AddressComponent {
    if (!type)
      return null;

    if (!address || !address.address_components || address.address_components.length == 0)
      return null;

    type = type.toLowerCase();

    for (let comp of address.address_components) {
      if (!comp.types || comp.types.length == 0)
        continue;

      if (comp.types.findIndex(x => x.toLowerCase() == type) > -1)
        return comp;
    }

    return null;
  }


  onAdressEvent(event: LocationModel) {
    console.log(event);
    if (event) {
      this.loggedInUser.Latitude = event.lat;
      this.loggedInUser.Longitude = event.lng;
      this.loggedInUser.AddressLineHome = event.addressLine;
    }
  }
  showSuccess(detail, summary = 'Success', severity = 'success') {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
  }
  logout() {
    this.accountService.logout();
  }
  dashboard() {
    this.routeTo.navigate(['/admin/dashboard'])

  }
}
