import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/models';
import { CompanyCategoryService } from 'src/services/companycategory.service';
import { COMPANY_TYPE } from 'src/shared/constants';

@Component({
  selector: 'app-shop-by-catergory',
  templateUrl: './shop-by-catergory.component.html',
  styleUrls: ['./shop-by-catergory.component.scss']
})
export class ShopByCatergoryComponent implements OnInit {
  allCategories: Category[];
  subCatergories: Category[];
  @Input() parentId;
  allCategoriesWithImages: Category[];
  defImage;
  constructor(private companyCategoryService: CompanyCategoryService, private router: Router) { }

  ngOnInit() {
    this.companyCategoryService.getSystemCategories('All', COMPANY_TYPE)
    this.companyCategoryService.systemCategoryListObservable.subscribe(data => {
      if (data) {
        this.allCategories = data;
        this.allCategoriesWithImages = data.filter(x=>x.ImageUrl && x.ImageUrl.length > 3);
        this.allCategoriesWithImages.map(x=>x.Style={'background-image':`url('${x.ImageUrl}')`})
        this.subCatergories = this.allCategories.filter(x => x.ParentId
          && x.ProductsImages && x.ProductsImages.length);
        if (this.parentId) {
          this.subCatergories = this.subCatergories.filter(x => x.ParentId === this.parentId);
        }
      }
    });
  }
  goto(event) {
    this.router.navigate([event]);
  }
  select(e){}
  tapChildCategory(category: any) {
    if (category && category.CategoryId) {
      this.goto(`home/collections/${category.CategoryId}`);
      return;
    }

  }

  selectCategory(category: Category) {
    this.router.navigate([`collections/${category.CategoryId}`])
  }
}
