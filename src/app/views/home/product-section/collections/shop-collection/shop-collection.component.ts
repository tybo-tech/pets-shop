import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, Category } from 'src/models';
import { CompanyCategoryService, OrderService, ProductService } from 'src/services';
import { HomeShopService } from 'src/services/home-shop.service';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-shop-collection',
  templateUrl: './shop-collection.component.html',
  styleUrls: ['./shop-collection.component.scss']
})
export class ShopCollectionComponent implements OnInit {
  products: Product[];
  catergoryId: string;
  subCatergoryId: string;
  catergory: Category;
  catergories: Category[];
  searchString: string;
  defImage = `https://via.placeholder.com/150`
  allProducts: Product[];
  constructor(
    private activatedRoute: ActivatedRoute,
    private homeShopService: HomeShopService,
    private uxService: UxService,
    private productService: ProductService,
    private orderService: OrderService,
    private companyCategoryService: CompanyCategoryService,
    private router: Router,
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.catergoryId = r.id;
      this.subCatergoryId = r.subId;
      if (!this.catergoryId)
        this.getCatergories();

      if (this.catergoryId) {
        this.getProducts(this.catergoryId);
        this.getSelectedCatagory(this.catergoryId);
      }
    });
  }

  ngOnInit() {
  }

  getCatergories() {
    this.companyCategoryService.systemCategoryListObservable.subscribe(data => {
      this.catergories = data || [];
      this.catergories.map(x=>x.Style={'background-image':`url('${x.ImageUrl}')`})
      if (this.catergories.length > 0)
        this.catergories = this.catergories.filter(x => Number(x.StatusId) === 1);
    })
  }

  getSelectedCatagory(catergoryId: string) {
    this.companyCategoryService.systemCategoryListObservable.subscribe(data => {
      // debugger
      if (data && data.length) {
        this.catergory = data.find(x => x.CategoryId === catergoryId);
        if (this.catergory && this.catergory.Children && this.catergory.Children.length) {
          this.catergory.Children.map(x => x.Class = []);
          const child = this.catergory.Children.find(x => x.CategoryId === this.subCatergoryId);
          if (child)
            child.Class = ['active'];
        }
      }
    })
  }
  back() {
    if (this.catergory && this.catergory.Products && this.catergory.Products.length) {
      const model = this.catergory.Products[0];
      this.router.navigate([model.CompanyId]);
      return;
    }
    this.router.navigate(['']);
  }

  viewMore(product: Product) {
    if (product) {
      this.uxService.keepNavHistory({
        BackToAfterLogin: `collections/${this.catergoryId}`,
        BackTo: `collections/${this.catergoryId}`,
        ScrollToProduct: null
      });
      this.homeShopService.updateProductState(product);
      this.router.navigate(['shop/product', product.ProductSlug])
    }
  }

  getProducts(categoryId, maxId = 9999999) {
    this.productService.getAllActiveByParentCategoryId(categoryId, maxId).subscribe(data => {
      if (data) {
        this.products = data;
        this.allProducts = data;
        if (this.subCatergoryId) {
          this.products = this.allProducts.filter(x => x.CategoryGuid === this.subCatergoryId);
        }
      }
    });
  }
  select(catergory: Category) {
    this.router.navigate([`/collections/${catergory.CategoryId}`])
  }
  selectSub(catergory: Category, isAll: string = '') {
    if (isAll != 'all')
      this.router.navigate([`/collections/${this.catergoryId}/${catergory.CategoryId}`]);
      else
      this.router.navigate([`/collections/${this.catergoryId}`]);

  }
}
