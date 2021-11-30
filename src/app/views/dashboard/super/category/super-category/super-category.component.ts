import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, User } from 'src/models';
import { UserService, AccountService, CompanyCategoryService } from 'src/services';
import { UxService } from 'src/services/ux.service';
import { COMPANY_TYPE } from 'src/shared/constants';

@Component({
  selector: 'app-super-category',
  templateUrl: './super-category.component.html',
  styleUrls: ['./super-category.component.scss']
})
export class SuperCategoryComponent implements OnInit {
  category: Category;
  categoryId: string;
  showModal: boolean;
  modalHeading: string;
  user: User;
  selectedIndex = 0;
  heading: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private categoryService: CompanyCategoryService,
    private router: Router,
    private uxService: UxService,
    private accountService: AccountService,
    private _snackBar: MatSnackBar
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.categoryId = r.id;
      this.user = this.accountService.currentUserValue;
      this.load();
    });

  }


  ngOnInit() {


  }

  load() {

    if (this.categoryId !== 'add') {
      this.categoryService.getCategory(this.categoryId).subscribe(data => {
        if (data && data.CategoryId) {
          this.category = data;
          this.heading = this.category.Name;
        }
      })
    } else {
      this.category = {
        CategoryId: '',
        Name: '',
        ParentId: '',
        Description: '',
        DisplayOrder: 0,
        CategoryType: 'Parent',
        CompanyType: COMPANY_TYPE,
        ImageUrl: '',
        PhoneBanner: '',
        IsDeleted: false,
        CreateUserId: this.user.UserId,
        ModifyUserId: this.user.UserId,
        StatusId: 1,
        Children: []
      };

      this.heading = `Adding new category`;
    }
  }
  back() {
    this.router.navigate([`/admin/dashboard/super-categories`]);
  }
  add() {
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }

  openSnackBar(message, heading) {
    const snackBarRef = this._snackBar.open(message, heading, {
      duration: 3000
    });

  }
  saveAll() { }


  save() {
    if (this.category.CategoryId && this.category.CategoryId.length > 5) {
      this.categoryService.update(this.category).subscribe(data => {
        if (data && data.CategoryId) {
          this.showSuccess('Category details saved.');
        }
      });

    }
    else {
      this.categoryService.add(this.category).subscribe(data => {
        if (data && data.CategoryId) {
          this.showSuccess('Category details saved.');
        }
      });
    }
  }
  showSuccess(message: string) {
    this.uxService.updateMessagePopState(message)
  }
}
