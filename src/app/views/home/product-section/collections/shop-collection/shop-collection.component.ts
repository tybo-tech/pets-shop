import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, Category, Order, Orderproduct } from 'src/models';
import { TyboShopModel } from 'src/models/TyboShop';
import { OrderService, ProductService } from 'src/services';
import { HomeShopService } from 'src/services/home-shop.service';
import { UxService } from 'src/services/ux.service';
import { COMPANY, ORDER_TYPE_SALES } from 'src/shared/constants';

@Component({
  selector: 'app-shop-collection',
  templateUrl: './shop-collection.component.html',
  styleUrls: ['./shop-collection.component.scss']
})
export class ShopCollectionComponent implements OnInit {

  product: Product;
  productSlug: string;
  totalPrice = 0;
  quantity = 0;
  catergoryId: string;
  subCatergoryId: string;
  catergory: Category;
  @Output() navAction: EventEmitter<boolean> = new EventEmitter<boolean>();
  tyboShopModel: TyboShopModel;
  products: Product[];
  heading: string;
  subProducts: Product[];
  tittle: string;
  order: Order;
  modalHeading: string;
  searchString: string;
  Total: number;
  selectedQuantiy: number = 1;
  showCart: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private homeShopService: HomeShopService,
    private uxService: UxService,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router,
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.catergoryId = r.id;
      this.subCatergoryId = r.subId;

      this.getProducts();
    });
  }

  ngOnInit() {
    this.initOrder();
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
  like() { }
  updateTotalPrice(quantity) {
    if (!quantity) {
      quantity = 1;
    }
    this.quantity = quantity;
  }
  onNavItemClicked(p) { }
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

  getProducts() {
    this.subProducts = [];
    this.tyboShopModel = this.productService.currentTyboShopValue;
    this.productService.tyboShopObservable.subscribe(data => {
      if (data && data) {
        this.products = data.Products;
        if (this.subCatergoryId)
          this.subProducts = this.products.filter(x => x.CategoryGuid === this.subCatergoryId);
        this.products = this.products.filter(x => x.ParentCategoryGuid === this.catergoryId);
        if (this.products.length)
          this.tittle = `More ${this.products[0].ParentCategoryName} products`;

      }
    });

    this.productService.getTyboShop(9999999);

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
      this.showCart = true;
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
