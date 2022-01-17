import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, User } from 'src/models';
import { AccountService, OrderService } from 'src/services';
import { CompanyService } from 'src/services/company.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  orders: Order[];
  notPaidOrders: Order[] = [];
  processingPaidOrders: Order[] = [];
  inTransitOrders: Order[] = [];
  user: User;
  statModel:any;
  constructor(
    private accountService: AccountService,
    private router: Router,
    private companyService: CompanyService,


  ) { }


  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.companyService.getAdminStat().subscribe(data=>{
      if(data){
        console.log('Stat: ',data);
        this.statModel = data;
      }
    })
  }
  goto(url) {
    this.router.navigate([`admin/dashboard/${url}`]);
  }

}
