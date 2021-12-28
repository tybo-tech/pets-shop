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
  selectedQuantiy: number;
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

    this.initOrder();

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
    this.productService.getTyboShop(this.pageNumber);
    // this.productService.getAllActiveByparentCategoryId(this.catergoryId, this.nextPage).subscribe(data => {
    //   if (data && data.length) {
    //     this.products.push(...data);
    //     this.pageNumber = data[data.length - 1]?.Id || 99999999;
    //     this.showShowMore = data.length >= MAX_PAGE_SIZE;
    //   } else {
    //     this.showShowMore = false;
    //   }
    // });

  }

  viewMore(product: Product) {
    this.router.navigate(['/products', product.ProductSlug])
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
        Shipping: '',
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
      this.showCartEvent();
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
  like() {

  }


  checkout() {
    this.showCartEvent();
    this.router.navigate([`shopping/checkout/${this.order.OrdersId || 'add'}/information`])
  }


  showCartEvent() {
    this.showCart = !this.showCart;
    if (this.showCart) {
      var body = this._document.getElementById('_body');
      if (body)
        body.style.overflow = 'hidden'

    }

    if (!this.showCart) {
      var body = this._document.getElementById('_body');
      if (body)
        body.style.overflowY = 'scroll'
    }
  }
}
