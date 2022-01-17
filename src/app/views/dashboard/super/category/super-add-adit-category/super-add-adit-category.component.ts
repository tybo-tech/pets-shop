import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { Category } from 'src/models/category.model';
import { ModalModel } from 'src/models/modal.model';
import { UploadService, CompanyCategoryService, AccountService } from 'src/services';
import { COMPANY_TYPE, IMAGE_DONE } from 'src/shared/constants';

@Component({
  selector: 'app-super-add-adit-category',
  templateUrl: './super-add-adit-category.component.html',
  styleUrls: ['./super-add-adit-category.component.scss']
})
export class SuperAddAditCategoryComponent implements OnInit {
  @Input() category: Category;
  // <app-super-add-adit-category [category]="category">
  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Go back to categories',
    routeTo: 'admin/dashboard/categories',
    img: undefined
  };
  showLoader;
  user: import("c:/ndu/apps/pets-shop/src/models/user.model").User;
  categoryId: any;
  heading: string;
  constructor(
    private uploadService: UploadService,
    private categoryService: CompanyCategoryService,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private messageService: MessageService,
    private router: Router,


  ) {
    this.activatedRoute.params.subscribe(r => {
      this.categoryId = r.id;
      this.user = this.accountService.currentUserValue;
      this.load();
    });
  }

  ngOnInit() {
  }

  public uploadFile = (files: FileList, name) => {
    if (files.length === 0) {
      return;
    }

    Array.from(files).forEach(file => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', `tybo.${file.name.split('.')[file.name.split('.').length - 1]}`); // file extention
      this.uploadService.uploadFile(formData).subscribe(url => {
        if (name === 'PC') {
          this.category.ImageUrl = `${environment.API_URL}/api/upload/${url}`;
        }
        if (name === 'Mobile') {
          this.category.PhoneBanner = `${environment.API_URL}/api/upload/${url}`;
        }
      });

    });
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
  save() {
    if (this.category.CategoryId && this.category.CategoryId.length > 5) {
      this.categoryService.update(this.category).subscribe(data => {
        if (data && data.CategoryId) {
          this.modalModel.heading = `Success!`
          this.modalModel.img = IMAGE_DONE;
          this.modalModel.body.push('Category details saved.');
          this.messageService.add({ severity: 'success', summary: 'Category details saved.', detail: '' });

        }
      });

    }
    else {
      this.categoryService.add(this.category).subscribe(data => {
        if (data && data.CategoryId) {
          this.categoryService.update(this.category).subscribe(data => {
            this.modalModel.heading = `Success!`
            this.modalModel.img = IMAGE_DONE;
            this.modalModel.body.push('Category created.')
            this.messageService.add({ severity: 'success', summary: 'Category details saved.', detail: '' });
          });
        }
      });
    }
  }
  back() {
    this.router.navigate([`/admin/dashboard/categories`]);
  }

  onImageChangedEvent(url) {
    this.category.ImageUrl = url;
  }

}
