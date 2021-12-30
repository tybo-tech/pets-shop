import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, Order, Orderproduct, Product, User } from 'src/models';
import { Interaction } from 'src/models/interaction.model';
import { TyboShopModel } from 'src/models/TyboShop';
import { NavHistoryUX } from 'src/models/UxModel.model';
import { ProductService, AccountService, CompanyCategoryService, OrderService } from 'src/services';
import { CompanyService } from 'src/services/company.service';
import { HomeShopService } from 'src/services/home-shop.service';
import { InteractionService } from 'src/services/Interaction.service';
import { UxService } from 'src/services/ux.service';
import { COMPANY, MAX_PAGE_SIZE, ORDER_TYPE_SALES } from 'src/shared/constants';


@Component({
  selector: 'app-product-section',
  templateUrl: './product-section.component.html',
  styleUrls: ['./product-section.component.scss']
})
export class ProductSectionComponent implements OnInit {
  @Input() topclass;
  selectedCategory: Category;
  searchString: string;
  products: Product[] = [];
  allProducts: Product[];
  user: User;
  navHistory: NavHistoryUX;
  showAdd: boolean;
  parentCategories: Category[] = [];
  catergories: Category[] = [];
  tertiaryCategories: Category[] = [];
  pickedProducts: Product[];
  newProducts: Product[];
  tyboShopModel: TyboShopModel;
  allOtherProducts: Product[]; yPosition: number;
  newInScrollTo = 0;
  pageNumber: number = 9999999;
  showShowMore: boolean;
  newInproducts: Product[];
  topLadiesproducts: Product[];
  topMenproducts: Product[];
  order: Order;
  modalHeading: string;
  Total: number;
  showCart: boolean;
  carttItems: number;
  productId: any;
  product: Product;


  constructor(
    private productService: ProductService,
    private router: Router,
    private accountService: AccountService,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,

    @Inject(DOCUMENT) private _document: HTMLDocument


  ) {
    this.activatedRoute.params.subscribe(r => {
      this.productId = r.id;
      if (this.productId)
        this.getProduct();
      else
        this.getProducts();
    });
  }
  getProduct() {
    this.productService.getProductSync(this.productId).subscribe(data => {
      this.product = data;
    })
  }

  ngOnInit() {

    this.user = this.accountService.currentUserValue;

    this.orderService.OrderObservable.subscribe(data => {
      this.order = data;
      this.carttItems = 0;
      if (this.order && this.order.Orderproducts)
        this.carttItems = this.order.Orderproducts.length
    })
  }


  getProducts() {

    this.tyboShopModel = this.productService.currentTyboShopValue;
    this.productService.tyboShopObservable.subscribe(data => {
      if (data) {
        if (JSON.stringify(data.Products) !== JSON.stringify(this.products)) {
          this.tyboShopModel = data;
          this.products.push(...data.Products)
          this.allProducts = data.Products;
          this.pickedProducts = data.Picked;
          this.pageNumber = this.products[this.products.length - 1]?.Id || 99999;
          this.showShowMore = data.Products.length >= MAX_PAGE_SIZE;
        }
        // this.newInproducts = this.products.filter(x => x.CategoryGuid === CATEGORIES[0].Id);
        // this.topLadiesproducts = this.products.filter(x => x.CategoryGuid === CATEGORIES[1].Id);
        // this.topMenproducts = this.products.filter(x => x.CategoryGuid === CATEGORIES[2].Id);

      }
    });

    this.productService.getTyboShop(9999999);

  }

  loadMore() {
    this.productService.getTyboShop(this.pageNumber)

  }

  viewMore(product: Product) {
    this.router.navigate(['/products', product.ProductSlug])
  }

  tapChildCategory(category: Category) {
    if (category) {
      this.products = this.products = this.allProducts.filter(x => x.CategoryGuid === category.CategoryId);
    }

  }
  all() {
    this.products = this.products = this.allProducts;

  }

  goto(url) {
    this.router.navigate([url]);
  }

  openParent(parentId: string) {
    alert(parentId)
  }



  tabParentCategories(category: Category) {
    console.log(category);
    if (category) {
      this.parentCategories.map(x => x.Class = ['']);
      category.Class = ['active'];
    }
  }

  gotoComapny(product: Product) {
    if (product.Company) {
      this.router.navigate([product.Company.Slug || product.CompanyId]);
      return;
    }
    this.router.navigate([product.CompanyId]);
  }

  veiwAllPicks() {
    this.goto(`home/collections/picks`)
  }

  selectCategory(category: string) {
    this.router.navigate([`collections/${category}`])
  }




}
