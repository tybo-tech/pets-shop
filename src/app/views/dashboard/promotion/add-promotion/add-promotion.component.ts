import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Product, User } from 'src/models';
import { Promotion } from 'src/models/promotion.model';
import { BreadModel } from 'src/models/UxModel.model';
import { AccountService, ProductService, UploadService } from 'src/services';
import { PromotionService } from 'src/services/promotion.service';
import { UxService } from 'src/services/ux.service';
import { CURRENCY, DISCOUNT_APPLIES_TO, DISCOUNT_GROUP, DISCOUNT_MIN_RQS, DISCOUNT_TYPES } from 'src/shared/constants';

@Component({
  selector: 'app-add-promotion',
  templateUrl: './add-promotion.component.html',
  styleUrls: ['./add-promotion.component.scss']
})
export class AddPromotionComponent implements OnInit {


  promotion: Promotion;
  user: User;
  promotionId: string;
  promotions: Promotion[] = [];
  heading: string;
  searchString: string;
  items: BreadModel[];
  selectedProducts: Product[] = [];
  selectedGetsProducts: Product[] = [];
  selectedProductsIdsForGet: string[] = [];
  showAdd: boolean;
  showProductsOption: boolean;
  showAddCustomerGets: boolean;
  DISCOUNT_GROUP = DISCOUNT_GROUP;
  DISCOUNT_TYPES = DISCOUNT_TYPES;
  DISCOUNT_APPLIES_TO = DISCOUNT_APPLIES_TO;
  DISCOUNT_MIN_RQS = DISCOUNT_MIN_RQS;
  CURRENCY = CURRENCY;
  constructor(
    private promotionService: PromotionService,
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private uploadService: UploadService,
    private uxService: UxService,
    private productService: ProductService,
    private messageService: MessageService
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.promotionId = r.id;
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (!this.user || !this.user.CompanyId) {
      this.router.navigate(['home/sign-in']);

    }

    this.items = [
      {
        Name: 'Dashboard',
        Link: '/admin/dashboard'
      },
      {
        Name: 'Promotions',
        Link: '/admin/dashboard/promotions'
      },

    ];


    this.loadPromotion();


  }
  back() {
    this.router.navigate(['admin/dashboard/discounts']);
  }

  loadPromotion() {
    if (this.promotionId === 'add') {
      this.promotion = {
        PromotionId: '',
        Name: `Promotion ${this.promotions.length + 1}`,
        CompanyId: this.user.CompanyId,
        PromoGroup: DISCOUNT_GROUP[0],
        PromoCode: '',
        PromoType: DISCOUNT_TYPES[0],
        DiscountValue: '',
        DiscountUnits: '',
        AppliesTo: DISCOUNT_APPLIES_TO[0],
        AppliesValue: `${(new Date().getTime())}`,
        CustomerGetsValue: '',
        MinimumRequirements: DISCOUNT_MIN_RQS[0],
        MinimumRequirementValue: '',
        StartDate: '',
        FinishDate: '',
        StartTime: '',
        FinishTime: '',
        ImageUrl: '',
        Bg: '#F3CF3D',
        Color: '#000000',
        CreateUserId: this.user.CompanyId,
        ModifyUserId: this.user.CompanyId,
        StatusId: 1,
      }
      this.heading = 'Create Discount'
      this.items.push({
        Name: this.heading,
        Link: null
      });
    }

    if (this.promotionId && this.promotionId.length > 5) {
      this.promotionService.get(this.promotionId).subscribe(data => {
        this.promotion = data;
        this.promotion.StartDate = this.promotion.StartDate.split('T')[0];
        this.promotion.FinishDate = this.promotion.FinishDate.split('T')[0];
        if (!this.promotion.AppliesValue) {
          this.promotion.AppliesValue = `${(new Date().getTime())}`
        }
        this.heading = `View Discount`;
        this.items.push({
          Name: this.promotion.Name,
          Link: null
        });
      })

    }
  }





  savePromotion() {
    this.promotion.Name = this.promotion.PromoCode;
    // this.promotion.MinimumRequirementValue = this.promotion.MinimumRequirementValue || this.promotion.MinimumRequirements;
    if (this.promotion.MinimumRequirements === DISCOUNT_MIN_RQS[0]) {
      this.promotion.MinimumRequirementValue = '';
    }
    this.promotion.DiscountUnits = this.getUnits(this.promotion.PromoType);
    this.promotion.CustomerGetsValue = JSON.stringify(this.selectedProductsIdsForGet);
    this.promotion.StartDate = `${this.promotion.StartDate}T${this.promotion.StartTime}:00`;
    this.promotion.FinishDate = `${this.promotion.FinishDate}T${this.promotion.FinishTime}:00`;
   
    if (this.promotionId === 'add') {
      this.addNewPromotion();
      return;
    }

    this.promotionService.update(this.promotion).subscribe(data => {
      if (data && data.PromotionId) {
        this.messageService.add({ severity: 'success', summary: 'Promotion saved.', detail: '' });
        if (this.promotion.AppliesTo === DISCOUNT_APPLIES_TO[0]) {
          this.productService.applyDiscountToAllProducts(this.promotion.AppliesValue).subscribe(e=>{});
        }
        this.ngOnInit();
      }

    })
  }

  addNewPromotion() {
    this.promotionService.add(this.promotion).subscribe(data => {
      if (data && data.PromotionId) {
        // this.view(data);
        this.ngOnInit();
        if (this.promotion.AppliesTo === DISCOUNT_APPLIES_TO[0]) {
          this.productService.applyDiscountToAllProducts(this.promotion.AppliesValue).subscribe(e=>{});
        }
        this.messageService.add({ severity: 'success', summary: 'Promotion created successfully.', detail: '' });

      }

    })
  }

  getUnits(type: string) {
    if (type === this.DISCOUNT_TYPES[0]) {
      return '% OFF'
    }
    if (type === this.DISCOUNT_TYPES[1]) {
      return `${CURRENCY} OFF`;
    }
    return ''
  }

  public uploadFile = (files: FileList) => {
    if (files.length === 0) {
      return;
    }

    Array.from(files).forEach(file => {
      this.uploadService.resizeImage(file, null, null, null, this.promotion);
    });




  }
  selectAndSerach(product: Product) {
    this.searchString = product.Name;
    this.showAdd = true;
  }
  selectAndSerachForGet(product: Product) {
    this.searchString = product.Name;
    this.showAddCustomerGets = true;
  }

  togleProductModal() {
    this.showProductsOption = !this.showProductsOption;
    this.uxService.showHideBodyScroller(this.showProductsOption);
  }
}
