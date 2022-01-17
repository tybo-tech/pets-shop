import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { User } from 'src/models';
import { Company } from 'src/models/company.model';
import { AccountService } from 'src/services';
import { CompanyService } from 'src/services/company.service';
import { VAT_DISPLAY, VAT_RATES } from 'src/shared/constants';

@Component({
  selector: 'app-vat',
  templateUrl: './vat.component.html',
  styleUrls: ['./vat.component.scss']
})
export class VatComponent implements OnInit {
  user: User;
  company: Company;
  VAT_DISPLAY = VAT_DISPLAY;
  VAT_RATES = VAT_RATES;
  constructor(private accountService: AccountService, private companyService: CompanyService, private messageService: MessageService,


  ) { }

  ngOnInit(): void {
    this.accountService.user.subscribe(data => {
      this.user = data;
      if (this.user && this.user.Company) {
        this.company = this.user.Company;

        if (!this.company.IsVATCharged)
          this.company.IsVATCharged = 'Yes';

        if (!this.company.PriceIncludeVAT)
          this.company.PriceIncludeVAT = 'No';

        if (!this.company.DefaultProductVAT)
          this.company.DefaultProductVAT = 'Taxable';

      }
    })
  }


  save() {
    this.companyService.update(this.company).subscribe(data => {
      if (data && data.CompanyId) {
        this.user.Company = data;
        this.accountService.updateUserState(this.user);
        this.companyService.updateCompanyState(data);
        this.messageService.add({ severity: 'success', summary: 'VAT setting saved successfully ', detail: '' });
      }
    })
  }


}
