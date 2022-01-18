import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LocationStrategy } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenModel, ChangePasswordModel } from 'src/models/account.model';
import { AccountService } from 'src/services/account.service';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/services';
import { User } from 'src/models';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../forgot-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  token;
  hidePassword = true;
  error: string;
  showLoader: boolean;
  loading: boolean;
  password: string;
  confirmPassword: string;
  user: User;


  constructor(
    private routeTo: Router,
    private location: LocationStrategy,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private messageService: MessageService,

  ) {

    this.activatedRoute.params.subscribe(r => {
      this.token = r.id;
      if (this.token) {
        this.getUserByToken();
      }
    });
  }

  ngOnInit() {
  }

  getUserByToken() {

    const tokenModel: TokenModel = { Token: this.token };
    this.accountService.getUserByToken(tokenModel).subscribe(data => {
      if (data) {
        this.loading = false;
        this.user = data;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `Link not valid` });

      }
    });
  }

  onSubmit() {
    const model: ChangePasswordModel = { Email: this.user.Email, Password: this.password, ConfirmPassword: this.confirmPassword }
    this.error = undefined;
    this.showLoader = true;
    if (model.ConfirmPassword !== model.Password) {
      this.error = 'Password(s) must match!';
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Password(s) must match!` });

      this.showLoader = false;
      return;
    }
    this.user.Password = this.password;
    this.user.UserToken = `${new Date()}`;
    this.userService.updateUserSync(this.user).subscribe(data => {
      if (data) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Please login with your new credentials` });
        this.routeTo.navigate(['/sign-in']);

      } else {
        alert('Error: 1003,Something went wrong, please try again later!');
        this.routeTo.navigate(['']);
      }
    });
  }


}
