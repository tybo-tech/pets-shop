import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Product } from 'src/models';
import { ProductService } from 'src/services';

@Component({
  selector: 'app-promotion-products',
  templateUrl: './promotion-products.component.html',
  styleUrls: ['./promotion-products.component.scss']
})
export class PromotionProductsComponent implements OnInit {
  showLoader: boolean;
  @Input() user: any;
  @Input() appliesValue: any;
  products: Product[];
  searchString: string;
  constructor(private productService: ProductService, private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getProducts();
  }
  getProducts() {
    this.showLoader = true;
    this.productService.getProductsSync(this.user.CompanyId).subscribe(data => {
      this.products = data;
      console.log(this.products);
      this.showLoader = false;
    })
  }

  select(product: Product, appliesValue, msg = `Product added to discount`) {
    product.PromotionLinkId = appliesValue;
    if (product.ProductId && product.CreateDate) {
      this.productService.update(product).subscribe(data => {
        if (data) {
          this.messageService.add({ severity: 'success', summary: '', detail: msg });
        }
      });
    }
  }
}
