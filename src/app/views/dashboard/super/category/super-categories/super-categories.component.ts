import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Modal } from 'bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Category, User } from 'src/models';
import { AccountService, CompanyCategoryService } from 'src/services';
import { COMPANY_TYPE } from 'src/shared/constants';

@Component({
  selector: 'app-super-categories',
  templateUrl: './super-categories.component.html',
  styleUrls: ['./super-categories.component.scss'],
  providers: [MessageService]
})
export class SuperCategoriesComponent implements OnInit {
  categories: Category[] = [];
  allCategories: Category[] = [];
  parentCategories: Category[];
  category: Category;
  subCategory: Category;
  addEditCategory: Category;
  isAll = true;
  isCat;
  isSub;
  user: User;
  heading: string = 'Categories';
  index = 0;
  ctaCreate: string;
  showModal: boolean;
  showActive = true;
  modalHeading = 'Add new parent category';
  addHeading = 'Add category';
  categoryTertiaryList: Category[] = [];
  closeResult: string = '';
  defImage: string = '';
  searchString: string;
  constructor(
    private accountService: AccountService,
    private categoryService: CompanyCategoryService,
    private router: Router,
    private modalService: NgbModal,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.categoryService.getSystemCategories('All', COMPANY_TYPE);
    this.categoryService.systemCategoryListObservable.subscribe(data => {
      if (data && data.length) {
        this.allCategories = data;
        this.categories = data;
        this.categories.map(x => x.IsSelected = false);

        this.parentCategories = this.categories.filter(x => x.CategoryType === 'Parent');
      
      }
    });
  }

  showSuccess(detail, summary = 'Success', severity = 'success') {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
  }
  edit(category: Category) {
    this.categoryService.getCategory(category.CategoryId).subscribe(data => {
      if (data && data.CategoryId) {
        this.category = category;
        // this.companyCategoryService.updateCategoryState(data);
        // this.router.navigate(['admin/dashboard/super-category', category.CategoryId]);
      }
    });
  }
  add(cat: Category = null) {
    if (cat) {
      this.router.navigate(['admin/dashboard/category', cat.CategoryId]);
      return;
    }
    this.router.navigate(['admin/dashboard/category', 'add']);
  }
  back() {
    this.router.navigate(['admin/dashboard']);
  }
  openCatergoryModal(content, parent: Category = null, category: Category = null) {
    if (category) {
      this.addEditCategory = category;
    }

    if (!category) {
      this.addEditCategory = {
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
      if (parent) {
        this.addEditCategory.ParentId = parent.CategoryId;
        this.addHeading = `Add sub category for ${parent.Name}`;
        this.addEditCategory.CategoryType = 'Child'
      } else {
        this.addHeading = `Add category`;

      }
    }


    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });


  }


  closeModal() {
    this.showModal = false;
  }


  filter() {
    this.showActive = !this.showActive;
    if (this.showActive) {
      this.categories = this.allCategories.filter(x => Number(x.StatusId) === 1);
      return;
    }
    this.categories = this.allCategories;
  }

  view(cat: Category) {
    this.router.navigate(['admin/dashboard/category', cat.CategoryId]);
    return;
  }

  viewSubCategory(subCategory: Category) {
    if (this.category) {
      this.category.Children.map(x => x.Class = []);
      this.subCategory = subCategory;
      this.subCategory.Class = ['active'];
    }
  }
  // delete(item: Category) {
  //   item.StatusId = 2;
  //   this.categoryService.update(item).subscribe(data => {
  //     if (data && data.CategoryId) {
  //       this.ngOnInit();
  //     }
  //   });
  // }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  // showSuccess() {
  //   this.toastService.show('I am a success toast', { classname: 'bg-success text-light', delay: 10000 });
  // }
  save() {
    if (this.addEditCategory.CategoryId && this.addEditCategory.CategoryId.length > 2) {
      this.categoryService.update(this.addEditCategory).subscribe(data => {
        if (data && data.CategoryId) {
          this.showSuccess(`Category updated`);
        }
      });

    }
    else {
      this.categoryService.add(this.addEditCategory).subscribe(data => {
        if (data && data.CategoryId) {
          this.ngOnInit();
          this.showSuccess(`Category created`);
        }
      });
    }
  }


  onImageChangedEvent(url) {
    if (!this.addEditCategory)
      return;

    this.addEditCategory.ImageUrl = url;
  }

  confirm(event: Event, category) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //confirm action
        this.delete(category);
      },
      reject: () => {
        //reject action
      }
    });
  }

  delete(category: Category) {
    if (!category)
      return;

    category.StatusId = 99;
    this.categoryService.update(category).subscribe(data => {
      this.categoryService.getSystemCategories('All', COMPANY_TYPE);
      this.messageService.add({ severity: 'error', summary: 'Category deleted.', detail: '' });
    })
  }
}
