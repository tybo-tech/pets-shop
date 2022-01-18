import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EmailGetRequestModel } from 'src/models/account.model';
import { Company } from 'src/models/company.model';
import { Email } from 'src/models/email.model';
import { AccountService } from 'src/services/account.service';
import { EmailService } from 'src/services/communication';
import { CompanyService } from 'src/services/company.service';
import { NOTIFY_EMAILS } from 'src/shared/constants';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  error;
  showLoader: boolean;
  showModal: boolean;
  hidePassword: boolean;
  email: string;
  company: Company;
  loading: boolean;

  constructor(
    private routeTo: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private emailService: EmailService,
    private messageService: MessageService,
    private companyService: CompanyService,

  ) { }

  ngOnInit() {
    this.companyService.companyObservable.subscribe(data => {
      if (data && data.CompanyId) {
        this.company = data;
      }
    })
  }

  onSubmit() {
    const model: EmailGetRequestModel = { Email: this.email }
    this.loading = true;
    this.accountService.generateToken(model).subscribe(data => {
      if (data.UserToken) {
        const email: Email = {
          Email: this.email,
          Subject: 'Forgot Password: Reset',
          Message: '',
          Link: this.accountService.generateForgotPasswordReturnLink(data.UserToken)
        };

        const emailBody =

          `
        
    <div
    style="padding: 2em; max-width: 30em; text-align: center; background: #ecf0f1;text-transform: uppercase; margin: 1em; border-radius: .5em;">
    <h1 style="font-size: 1.2em;">
      Forgot your password?
    </h1>

    <p style="padding: 1em 0;">
      That's okay, It happens! <br> Click on the button below to reset your password

    </p>

 
      <a style=" text-decoration: none;" href="${this.accountService.generateForgotPasswordReturnLink(data.UserToken)}">
      <button
      style="width: 15em;border: none; cursor: pointer; border-radius: .4em; margin: .5em auto; font-weight: 600; display: block; background: #000; color: #fff; padding: 1em; text-transform: uppercase;">reset
      your password</button>
      </a>

  </div>
        `;



        const emailToSend: Email = {
          Email: `${NOTIFY_EMAILS}, ${data.Email}`,
          Subject: `${this.company && this.company.Name || ''} password reset link`,
          Message: `${emailBody}`,
          UserFullName: data.Name,
          FromEmail: this.company && this.company.Email || 'noreplay@mail.com',
          // Link: `${environment.BASE_URL}`,
          // LinkLabel: 'Login to system'
        };
        this.emailService.sendGeneralTextEmail(emailToSend)
          .subscribe(response => {
            if (response > 0) {
              setTimeout(() => {
                this.loading = false;
                this.messageService.add({ severity: 'success', summary: 'Please check your emails', detail: `Password reset link sent to ${this.email}` });
              }, 0);
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: `Something went wrong, please try again later!` });

              this.routeTo.navigate(['']);
              return;
            }
          });

      }
    });
  }
  back() {
    this.routeTo.navigate(['home/sign-in'])
  }
}
