import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Company } from 'src/models/company.model';
import { User } from 'src/models/user.model';
import { AccountService } from 'src/services';
import { CompanyService } from 'src/services/company.service';


@Component({
  selector: 'app-company-contacts',
  templateUrl: './company-contacts.component.html',
  styleUrls: ['./company-contacts.component.scss']
})
export class CompanyContactsComponent implements OnInit {

  user: User;
  company: Company;
  constructor(private accountService: AccountService, private companyService: CompanyService, private messageService: MessageService,


  ) { }

  ngOnInit(): void {
    this.accountService.user.subscribe(data => {
      this.user = data;
      if (this.user && this.user.Company) {
        this.company = this.user.Company;
      }
    })
  }


  save() {
    this.companyService.update(this.company).subscribe(data => {
      if (data && data.CompanyId) {
        this.user.Company = data;
        this.accountService.updateUserState(this.user);
        this.companyService.updateCompanyState(data);
        this.messageService.add({ severity: 'success', summary: ' Company Info saved successfully ', detail: '' });
      }
    })
  }


}
