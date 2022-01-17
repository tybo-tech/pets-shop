import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Category } from 'src/models';
import { CompanyCategoryService } from 'src/services';

@Component({
  selector: 'app-altra-sub-category',
  templateUrl: './altra-sub-category.component.html',
  styleUrls: ['./altra-sub-category.component.scss']
})
export class AltraSubCategoryComponent implements OnInit {
  @Input() category: Category;
  categories: Category[];
  searchString: string;
  constructor(
    private categoryService: CompanyCategoryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.category)
      this.getCats();

  }
  getCats() {
    this.categoryService.getByParent(this.category.CategoryId)
      .subscribe(data => {
        this.categories = data || [];
      });
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
      this.getCats();
      this.messageService.add({ severity: 'error', summary: 'Category deleted.', detail: '' });
    })
  }

  view(cat: Category) {
    this.router.navigate(['admin/dashboard/sub-category', cat.CategoryId, this.category.CategoryId]);
    return;
  }

  add(cat: Category = null) {
    if (cat) {
      this.router.navigate(['admin/dashboard/sub-category', cat.CategoryId, this.category.CategoryId]);
      return;
    }
    this.router.navigate(['admin/dashboard/sub-category', 'add', this.category.CategoryId]);
  }
}
