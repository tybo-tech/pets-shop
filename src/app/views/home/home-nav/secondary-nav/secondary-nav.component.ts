import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/models';
import { CompanyCategoryService } from 'src/services';
import { COMPANY_TYPE } from 'src/shared/constants';

@Component({
  selector: 'app-secondary-nav',
  templateUrl: './secondary-nav.component.html',
  styleUrls: ['./secondary-nav.component.scss']
})
export class SecondaryNavComponent implements OnInit {
  allCategories: Category[];
  @Input() carttItems;
  categories: Category[];
  parentCategories: Category[];
  category: Category;
  showMenu
  productsMenu: MenuItemm = {
    Name: 'All products',
    Class: []
  }

  constructor(private categoryService: CompanyCategoryService, private router: Router
  ) { }

  ngOnInit() {
    this.categoryService.getSystemCategories('All', COMPANY_TYPE);
    this.categoryService.systemCategoryListObservable.subscribe(data => {
      if (data && data.length) {
        this.allCategories = data;
        this.categories = this.allCategories.filter(x => Number(x.StatusId) === 1);
        this.categories.map(x => x.IsSelected = false);
        this.categories.forEach(item => {
          if (item.Children)
            item.Children = item.Children.filter(x => Number(x.StatusId) === 1);
        })
        this.parentCategories = this.categories.filter(x => x.CategoryType === 'Parent');
      }
    });
  }
  view(c: Category) {
    this.router.navigate(['/collections', c.ParentId, c.CategoryId]);
    this.showMenu = false;
  }
  toggleMenu(catergory: Category) {
    if (catergory.IsSelected) {
      catergory.IsSelected = !catergory.IsSelected;
      return;
    }
    this.categories.map(x => x.IsSelected = false);
    catergory.IsSelected = !catergory.IsSelected;
  }
  goto(url: string) {
    this.router.navigate([url])
  }

}

export interface MenuItemm {
  Name: string;
  Class: string[];
}