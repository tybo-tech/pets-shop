import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category, Product, User, Order, Orderproduct } from 'src/models';
import { TyboShopModel } from 'src/models/TyboShop';
import { NavHistoryUX } from 'src/models/UxModel.model';
import { ProductService, AccountService, OrderService, CompanyCategoryService } from 'src/services';
import { HomeShopService } from 'src/services/home-shop.service';
import { UxService } from 'src/services/ux.service';
import { MAX_PAGE_SIZE, COMPANY, ORDER_TYPE_SALES } from 'src/shared/constants';

@Component({
  selector: 'app-products-widget',
  templateUrl: './products-widget.component.html',
  styleUrls: ['./products-widget.component.scss']
})
export class ProductsWidgetComponent implements OnInit {
  @Input() topclass;
  selectedCategory: Category;
  searchString: string;
  @Input() products: Product[];
  allProducts: Product[];
  user: User;
  navHistory: NavHistoryUX;
  showAdd: boolean;
  parentCategories: Category[] = [];
  catergories: Category[] = [];
  tertiaryCategories: Category[] = [];
  unisexCategory: Category;
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
  selectedQuantiy: number;
  modalHeading: string;
  Total: number;


  constructor(
    private homeShopService: HomeShopService,
    private productService: ProductService,
    private uxService: UxService,
    private router: Router,
    private accountService: AccountService,
    private orderService: OrderService,
    private companyCategoryService: CompanyCategoryService,

  ) {
  }

  ngOnInit() {

    this.user = this.accountService.currentUserValue;

    this.uxService.uxNavHistoryObservable.subscribe(data => {
      this.navHistory = data;
    })



    this.uxService.pageYPositionObservable.subscribe(data => {
      this.yPosition = data || 0;
    });


    this.uxService.uxNavHistoryObservable.subscribe(data => {
      if (data) {
        this.navHistory = data;
        window.scrollTo(0, this.navHistory.ScrollToYPositoin || 0);
      }
    });

    this.companyCategoryService.systemCategoryListObservable.subscribe(data => {
      if (data && data.length) {
        this.unisexCategory = data.find(x => x.Name === "Unisex");
      }
    });

    this.initOrder();
  }



  loadMore() {
    this.productService.getTyboShop(this.pageNumber);

  }

  viewMore(product: Product) {
    if (product) {
      window.scroll(0, 0);
      this.homeShopService.updateProductState(product);
      this.uxService.keepNavHistory({
        BackToAfterLogin: '/',
        BackTo: '/',
        ScrollToProduct: null,
        ScrollToYPositoin: this.yPosition
      });
      this.router.navigate(['shop/product', product.ProductSlug])
    }
  }
  // selectCategory(category: Category) {
  //   if (category && category.IsShop) {
  //     this.homeShopService.updateCategoryState(category);
  //     this.router.navigate([`shop/collections/${category.Name}`])
  //   }

  // }
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

  loadCategories() {
    const catergories = [];
    this.newProducts = [];
    this.allOtherProducts = [];

    this.productService.productListObservable.subscribe(products => {
      if (products && products.length) {
        this.allProducts = products;
        this.products = this.allProducts;
        let i = 0;
        this.products.forEach(product => {
          if (!catergories.find(x => x && x.CategoryId === product.CategoryGuid)) {
            if (product.Category) {
              catergories.push(product.Category);
            }
          }
          if (!this.parentCategories.find(x => x && x.CategoryId === product.ParentCategoryGuid)) {
            if (product.ParentCategory) {
              this.parentCategories.push(product.ParentCategory);
            }
          }
          if (!this.tertiaryCategories.find(x => x && x.CategoryId === product.TertiaryCategoryGuid)) {
            if (product.TertiaryCategory) {
              this.tertiaryCategories.push(product.TertiaryCategory);
            }
          }
          if (i < 30 && !product.PickId) {
            this.newProducts.push(product);
          }
          if (i >= 30 && !product.PickId) {
            this.allOtherProducts.push(product);
          }
          i++;
        });

        if (catergories && catergories.length) {
          this.catergories = catergories;
        }
        this.unisexCategory = this.parentCategories.find(x => x.Name === "Unisex");

        this.pickedProducts = this.allProducts.filter(x => x.PickId);
      }

    });
    // console.log(this.parentCategories);

  }

  tabParentCategories(category: Category) {
    console.log(category);
    if (category) {
      this.parentCategories.map(x => x.Class = ['']);
      category.Class = ['active'];
    }
  }

  gotoComapny(product: Product) {
    window.scroll(0, 0);
    if (product.Company) {
      this.router.navigate([product.Company.Slug || product.CompanyId]);
      return;
    }
    this.router.navigate([product.CompanyId]);
  }
  scroll(e) {
    this.newInScrollTo += e * 1000;
    document.getElementById("justAdded").scroll(this.newInScrollTo, 0)
  }
  veiwAllPicks() {
    this.goto(`home/collections/picks`)
  }

  selectCategory(category: string) {
    this.router.navigate([`collections/${category}`])
  }

  initOrder() {
    this.order = this.orderService.currentOrderValue;
    if (!this.order) {
      this.order = {
        OrdersId: '',
        OrderNo: 'Shop',
        CompanyId: COMPANY,
        CustomerId: '',
        AddressId: '',
        Notes: '',
        OrderType: ORDER_TYPE_SALES,
        Total: 0,
        Paid: 0,
        Due: 0,
        InvoiceDate: new Date(),
        DueDate: '',
        CreateUserId: 'shop',
        ModifyUserId: 'shop',
        Status: 'Not paid',
        StatusId: 1,
        Orderproducts: []
      }
      this.orderService.updateOrderState(this.order);
    }

  }

  addToCart(product: Product) {
    if (!this.order)
      return;

    if (!this.order.Orderproducts)
      this.order.Orderproducts = [];
      
    if (this.order && this.order.Orderproducts.length) {
      if (this.order.CompanyId !== product.CompanyId) {
        return false;
      }

    }

    if (product && product.ProductId) {
      product.SelectedQuantiy = this.selectedQuantiy;
      const orderproduct = this.mapOrderproduct(product);
      this.order.Orderproducts.push(orderproduct);
      if (product.Company) {
        this.order.Company = product.Company;
      }
      this.order.CompanyId = product.CompanyId;
      this.calculateTotalOverdue();
      this.order.Total = this.Total;
      this.orderService.updateOrderState(this.order);
      this.modalHeading = `${product.Name} added to bag successfully`;
      // this.cart();
    }
  }

  mapOrderproduct(product: Product): Orderproduct {
    return {
      Id: '',
      OrderId: '',
      ProductId: product.ProductId,
      CompanyId: product.CompanyId,
      ProductName: product.Name,
      ProductType: 'Product',
      Colour: product.SelectedCoulor || '',
      Size: product.SelectedSize || '',
      Quantity: product.SelectedQuantiy || 1,
      SubTotal: product.SelectedQuantiy * Number(product.RegularPrice),
      UnitPrice: product.SalePrice || product.RegularPrice,
      FeaturedImageUrl: product.FeaturedImageUrl,
      CreateUserId: '',
      ModifyUserId: '',
      StatusId: 1
    };
  }

  calculateTotalOverdue() {
    this.Total = 0;
    this.order.Orderproducts.forEach(line => {
      this.Total += (Number(line.UnitPrice) * Number(line.Quantity));
    });

  }
}
