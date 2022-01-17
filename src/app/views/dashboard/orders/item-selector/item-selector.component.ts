import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Category, Order, Orderproduct, Product, User } from 'src/models';
import { ProductVariation } from 'src/models/product.variation.model';
import { ProductVariationOption } from 'src/models/product.variation.option.model';
import { AccountService, CompanyCategoryService, ProductService } from 'src/services';
import { OrderService } from 'src/services/order.service';
import { UxService } from 'src/services/ux.service';
import { PRODUCT_ORDER_LIMIT_MAX, STATUS_TRASHED_STRING, STATUS_ACTIIVE_STRING, PRODUCT_TYPE_STOCK, PRODUCT_TYPE_JIT } from 'src/shared/constants';

@Component({
  selector: 'app-item-selector',
  templateUrl: './item-selector.component.html',
  styleUrls: ['./item-selector.component.scss']
})
export class ItemSelectorComponent implements OnInit {
  products: Product[];
  allProducts: Product[];
  user: User;
  showAdd: boolean;
  selecting: boolean = true;
  newProduct: Product;
  searchString: string;
  PRODUCT_ORDER_LIMIT_MAX = PRODUCT_ORDER_LIMIT_MAX;
  STATUS_TRASHED_STRING = STATUS_TRASHED_STRING;
  trasheddProducts: Product[];
  activeProducts: Product[];
  order: Order;

  constructor(
    private productService: ProductService,
    private accountService: AccountService,
    private companyCategoryService: CompanyCategoryService,
    private router: Router,
    private uxService: UxService,
    private orderService: OrderService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.uxService.updateLoadingState({ Loading: true, Message: 'Loading products, please wait.' })
    this.productService.getProductsSync(this.user.CompanyId).subscribe(data => {
      this.uxService.updateLoadingState({ Loading: false, Message: undefined });
      this.allProducts = data || [];
      this.allProducts.map(x => x.SelectedQuantiy = 1);
      this.all();
      this.trasheddProducts = this.allProducts.filter(product => product.ProductStatus === STATUS_TRASHED_STRING);
      this.activeProducts = this.allProducts.filter(product => product.ProductStatus === STATUS_ACTIIVE_STRING);

    })
    // this.loadCategories();

    this.orderService.OrderObservable.subscribe(data => {
      this.order = data;
      if (this.order && this.order.Orderproducts && this.order.Orderproducts.length) {
        this.selecting = false;
      } else {
        this.selecting = true;
      }
    })
  }
  loadCategories() {
    throw new Error('Method not implemented.');
  }
  goto(url) {
    this.router.navigate([`admin/dashboard/${url}`]);
  }
  addToCart(product: Product) {
    this.order = this.orderService.addToCart(product, this.order);
    this.messageService.add({ severity: 'success', summary: 'Added to cart', detail: '' });
    this.orderService.updateOrderState(this.order);

  }
  view(product: Product) {
    this.productService.updateProductState(product);
    this.router.navigate(['admin/dashboard/product', product.ProductSlug || product.ProductId]);
  }
  addProduct() {
    this.productService.updateProductState(null);
    this.showAdd = true;
    this.newProduct = {
      ProductId: undefined,
      ShowRemainingItems: 6,
      Name: '',
      RegularPrice: 0,
      PriceFrom: 0,
      TotalStock: 0,
      PriceTo: 0,
      Description: '',
      ProductSlug: '',
      CatergoryId: 0,
      ParentCategoryId: 0,
      CategoryName: '',
      ParentCategoryName: '',
      ParentCategoryGuid: '',
      CategoryGuid: '',
      TertiaryCategoryGuid: '',
      TertiaryCategoryName: '',
      ReturnPolicy: '',
      FeaturedImageUrl: '',
      IsJustInTime: PRODUCT_TYPE_STOCK,
      ShowOnline: true,
      EstimatedDeliveryDays: 0,
      OrderLimit: 0,
      SupplierId: '',
      ProductType: '',
      ProductStatus: STATUS_ACTIIVE_STRING,
      Code: '',
      CompanyId: this.user.CompanyId,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1,
    };
    if (!this.products) {
      this.products = [];
    }
    this.newProduct.Code =
      this.newProduct.Code = `P00${this.products.length + 1}`;
  }
  saveProduct() {
    this.newProduct.ProductSlug = this.productService.generateSlug(this.user.Company.Name, this.newProduct.Name, this.newProduct.Code);
    if (this.newProduct.IsJustInTime === PRODUCT_TYPE_JIT) {
      this.newProduct.TotalStock = this.newProduct.OrderLimit;
    }
    this.uxService.updateLoadingState({ Loading: true, Message: 'Adding product..., please wait.' })
    this.productService.add(this.newProduct).subscribe(data => {
      if (data && data.ProductId) {
        this.view(data);
        this.uxService.updateLoadingState({ Loading: false, Message: undefined });

      }
    });

  }


  tapChildCategory(category: Category) {
    if (category) {
      this.products = this.products = this.allProducts.filter(x => x.CategoryGuid === category.CategoryId);
    }

  }
  all() {
    this.products = this.allProducts.filter(product => product.ProductStatus === STATUS_ACTIIVE_STRING);

  }

  filterWith(status: string) {
    if (status === this.STATUS_TRASHED_STRING) {
      this.products = this.trasheddProducts;
    }
  }

  selectItem(item: User) {
    if (!this.order)
      return;

    this.order.Customer = item;
    this.order.CustomerId = item.UserId;
    this.orderService.updateOrderState(this.order);
    this.router.navigate([`/admin/dashboard/create-order/products`]);
    // this.doneSelectingCustomer.emit(item);
  }

  deleteFromCart(orderproduct: Orderproduct, index) {
    this.orderService.deleteFromCart(orderproduct, this.order, index);
    this.orderService.updateOrderState(this.order);
  }

  orderChanged() {
    this.orderService.calculateTotalOverdue(this.order);
    this.orderService.updateOrderState(this.order);
    this.messageService.add({ severity: 'success', summary: 'Order updated.', detail: '' });
  }
  qtyEvent(qty, orderproduct: Orderproduct) {
    orderproduct.Quantity = qty;
    this.orderChanged();
  }
  gotoShipping() {
    if (this.order.Orderproducts && !this.order.Orderproducts.length) {
      this.messageService.add({ severity: 'error', summary: 'Cart is Empty', detail: 'Please add some products to this order' });
      return;
    }
    this.router.navigate(['/admin/dashboard/create-order/shipping'])
  }
  gotoInfo() {
    this.router.navigate(['/admin/dashboard/create-order/customer'])
  }
}
