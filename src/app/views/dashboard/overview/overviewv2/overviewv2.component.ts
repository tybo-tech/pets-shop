import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Order, Product, User } from 'src/models';
import { ProductService, AccountService, CompanyCategoryService, OrderService } from 'src/services';
import { CompanyService } from 'src/services/company.service';
import { UxService } from 'src/services/ux.service';
import { ADMIN, SUPER } from 'src/shared/constants';

@Component({
  selector: 'app-overviewv2',
  templateUrl: './overviewv2.component.html',
  styleUrls: ['./overviewv2.component.scss']
})
export class Overviewv2Component implements OnInit {
 user: User;
  companyLink = '';
  ADMIN= ADMIN;
  SUPER=SUPER;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private uxService: UxService,
    ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if(!this.user || !this.user.Company){
      this.router.navigate(['sign-in'])
    }
    this.companyLink = `${environment.BASE_URL}/${this.user.Company.Slug || this.user.Company.CompanyId}`
  
  }
  loadCategories() {
    throw new Error('Method not implemented.');
  }
  goto(url) {
    this.router.navigate([`admin/dashboard/${url}`]);
  }


  gotoShop(){
    this.router.navigate(['']);
  }

  copy() {

    let nav: any;
    nav = window.navigator;
    if (nav.share) {
      nav.share({
        title: 'Hello!',
        text: 'Check out our shop.',
        url: this.companyLink,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      this.uxService.updateMessagePopState('Shop LinkCopied to clipboard.');
    }
  }
}
