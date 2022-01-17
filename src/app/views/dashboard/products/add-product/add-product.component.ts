import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { Category, CompanyCategory, Product, User } from 'src/models';
import { Company } from 'src/models/company.model';
import { Images } from 'src/models/images.model';
import { ProductVariation } from 'src/models/product.variation.model';
import { ProductVariationOption } from 'src/models/product.variation.option.model';
import { BreadModel } from 'src/models/UxModel.model';
import { AccountService, CompanyCategoryService, ProductService, UploadService } from 'src/services';
import { CompanyService } from 'src/services/company.service';
import { ImagesService } from 'src/services/images.service';
import { ProductVariationService } from 'src/services/product-variation.service';
import { UxService } from 'src/services/ux.service';
import { COMPANY_TYPE, PRODUCT_ORDER_LIMIT_MAX, PRODUCT_TYPE_STOCK, STATUS_ACTIIVE_STRING, STATUS_TRASHED_STRING, VAT_RATES } from 'src/shared/constants';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  showLoader;
  @Input() existingProduct: Product;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() addingProductFinished: EventEmitter<Product> = new EventEmitter();
  setUpVariations: boolean;
  VAT_RATES = VAT_RATES;
  heading = 'Add product'
  product: Product = {
    ProductId: '',
    ShowRemainingItems: 6,
    CompanyId: '',
    Name: '',
    TotalStock: 0,
    RegularPrice: 0,
    PriceFrom: 0,
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
    CreateDate: '',
    CreateUserId: '',
    ModifyDate: '',
    ModifyUserId: '',
    StatusId: 1,
  };
  shoWaddNewCatergory: boolean
  editorStyle = {
    height: '180px',
    marginBottom: '30px',
    color: 'black',
  };
  user: User;
  PRODUCT_ORDER_LIMIT_MAX = PRODUCT_ORDER_LIMIT_MAX;
  parentCategories: Category[] = [];
  chilndrenCategories: Category[] = [];
  tertiaryCategories: Category[] = [];
  categories: Category[] = [];


  modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      // ['image']
    ]
  };
  newCatergory: Category;
  sizes: ProductVariation;
  colors: ProductVariation;
  items: BreadModel[];
  STATUS_TRASHED_STRING = STATUS_TRASHED_STRING;
  productLink: any;
  productId: any;
  company: Company;
  // CATEGORIES = CATEGORIES;
  constructor(
    private router: Router,
    private productService: ProductService,
    private accountService: AccountService,
    private companyCategoryService: CompanyCategoryService,
    private uploadService: UploadService,
    private imagesService: ImagesService,
    private uxService: UxService,
    private productVariationService: ProductVariationService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private companyService: CompanyService,



  ) {
    this.activatedRoute.params.subscribe(r => {
      this.productId = r.id;
      if (this.productId !== 'add')
        this.getProduct();
      else
        this.loadNewProduct();

    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.company = this.companyService.companyValue;

    if (this.existingProduct && this.existingProduct.ProductId) {
      this.product = this.existingProduct;
    }
    else {
      this.product.CompanyId = this.user.CompanyId;
      this.product.CreateUserId = this.user.CompanyId;
      this.product.ModifyUserId = this.user.CompanyId;


    }



  }
  getProducts() {
    this.productService.getProducts(this.user.CompanyId);

    this.productService.productListObservable.subscribe(data => {
      if (data) {
        this.product.Code = `P00${data.length + 1}`;
      }
    });
  }
  getProduct() {
    this.productService.getProductSync(this.productId).subscribe(data => {
      if (data && data.ProductId) {
        this.product = data;
        this.loadCats();
        this.getProducts();
      }
    })
  }
  loadNewProduct() {
    this.product = {
      ProductId: undefined,
      CompanyId: '',
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
      CreateDate: '',
      CreateUserId: '',
      ModifyDate: '',
      ModifyUserId: '',
      StatusId: 1,
    };
    this.heading = `Adding new product`;
    this.loadCats();
    this.getProducts();
  }
  loadCats() {
    this.companyCategoryService.getSystemCategories('All', COMPANY_TYPE);;

    this.companyCategoryService.systemCategoryListObservable.subscribe(data => {
      if (data && data.length) {
        this.categories = data;
        this.parentCategories = this.categories && this.categories.filter(x => x.CategoryType === 'Parent' && Number(x.StatusId) === 1);
        if (this.parentCategories && this.parentCategories.length) {
          if (!this.product.ParentCategoryGuid) {
            const categoryId = this.parentCategories[0].CategoryId;
            this.product.ParentCategoryGuid = categoryId;
            this.selectCategory(categoryId);
          }
        }
        this.parentCategories.map(x => x.IsSelected = false);
        this.parentCategories.sort(function (a, b) {
          var textA = b.Name.toString();
          var textB = a.Name.toString();;
          return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
        });
        if (this.product && this.product.ProductId) {
          this.selectCategory(this.product.ParentCategoryGuid);
          if (this.product && this.product.ProductId && this.product.Images && this.product.Images.length) {
            let isMain = this.product.Images.find(x => x.IsMain == 1);
            if (!isMain) {
              isMain = this.product.Images[0];
              this.product.FeaturedImageUrl = isMain && isMain.Url;
              this.productService.update(this.product).subscribe(data => {
                if (data) {
                  this.product.Images[0].IsMain = 1;
                  this.imagesService.update(this.product.Images[0]).subscribe(ie => {
                    if (ie && ie.ImageId) {
                      console.log(ie);

                    }
                  })
                }
              });
            }
            this.product.FeaturedImageUrl = isMain && isMain.Url;
          }
        }
      }
    });

  }

  saveProduct() {
    this.product.ProductSlug = this.productService.generateSlug(this.user.Company.Name, this.product.Name, this.product.Code);
    this.product.CategoryName = this.chilndrenCategories.find(x => x.CategoryId === this.product.CategoryGuid)?.Name || '';
    this.product.ParentCategoryName = this.parentCategories.find(x => x.CategoryId === this.product.ParentCategoryGuid)?.Name || '';
    this.uxService.updateLoadingState({ Loading: true, Message: 'Saving a product, please wait...' })
    if (this.product.ProductId && this.product.CreateDate) {
      this.productService.update(this.product).subscribe(data => {
        this.uxService.updateLoadingState({ Loading: false, Message: undefined });

        if (data) {
          // this.addingProductFinished.emit(data);
          this.showSuccess(`Product updated`);

        }
      });
    } else {
      this.productService.add(this.product).subscribe(data => {
        if (data && data.ProductId) {
          this.product.ProductId = data.ProductId;
          this.product.CreateDate = data.CreateDate;
          // this.addingProductFinished.emit(data);
          this.showLoader = false;
          this.showSuccess(`Product created`);

        }
      });
    }

  }
  back() {
    this.router.navigate([`/admin/dashboard/products`]);
  }

  showSuccess(detail, summary = 'Success', severity = 'success') {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
  }
  selectCategory(categoryId: string) {
    if (categoryId && categoryId.length) {
      if (categoryId.split(':').length === 2) {
        categoryId = categoryId.split(':')[1].trim();
      }
      const selectParent = this.categories.find(x => x.CategoryId === categoryId);
      this.chilndrenCategories = [];
      if (selectParent) {
        this.chilndrenCategories = selectParent.Children;
      }

      this.chilndrenCategories.sort(function (a, b) {
        var textA = b.Name.toString();
        var textB = a.Name.toString();;
        return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
      });
      this.tertiaryCategories.sort(function (a, b) {
        var textA = b.Name.toString();
        var textB = a.Name.toString();;
        return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
      });


      if (!this.product.CategoryGuid && this.chilndrenCategories.length) {
        this.product.CategoryGuid = this.chilndrenCategories[0].CategoryId;
      }
    }
  }

  public uploadFile = (files: FileList) => {
    if (files.length === 0) {
      return;
    }

    Array.from(files).forEach(file => {
      this.uploadService.resizeImage(file, this.product);
    });




  }
  onProductVariationChanged(productVariations: ProductVariation[]) {
    if (productVariations && productVariations.length) {
      this.product.ProductVariations = productVariations;

    }

  }
  onCloseOptionModal(e) {
    this.setUpVariations = false;
  }
  saveImage(image: Images) {
    if (image) {

      this.showLoader = true;
      this.imagesService.add(image).subscribe(data => {
        if (data && data.ImageId) {
          if (!this.product.Images) {
            this.product.Images = [];
          }
          this.product.Images.push(data);
          if (!this.product.FeaturedImageUrl) {
            this.product.FeaturedImageUrl = this.product.Images[0].Url;
          }
          this.showLoader = false;
          this.uxService.updateMessagePopState(`New Image uploaded.`);
          this.productService.updateProductState(this.product);
        }

      })
    }
  }

  deleteImage(image: Images) {
    if (image) {
      image.StatusId = 2;
      this.showLoader = true;
      this.imagesService.update(image).subscribe(data => {
        if (data && data.ImageId) {
          this.showLoader = false;
          this.product.Images.splice(image.Index, 1);
          this.uxService.updateMessagePopState(`Image deleted.`);
        }

      })
    }
  }
  setMianImage(image: Images) {
    if (image) {
      const main = this.product.Images.find(x => x.ImageId === image.ImageId);
      if (main) {
        this.product.Images.map(x => x.IsMain = 0);
        main.IsMain = 1;
        this.showLoader = true;
        this.imagesService.updateRange(this.product.Images).subscribe(data => {
          if (data && data.ProductId && data.Images) {
            this.showLoader = false;
            this.product.Images = data.Images;
            this.product.FeaturedImageUrl = main.Url;
            this.product.Images.sort(function (a, b) {
              var textA = a.IsMain.toString();
              var textB = b.IsMain.toString();;
              return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
            });
            this.productService.updateProductState(this.product);
            this.productService.update(this.product).subscribe(data => {
              console.log(data);
            })
          }

        })
      }
    }
  }
  showImage(image: Images) {
    this.product.FeaturedImageUrl = image.Url;
  }



  toggleShowOnline(e: boolean) {

  }



  addCatergory(parentId = '') {
    const type = parentId === '' ? 'Parent' : 'Child';
    this.newCatergory = {
      CategoryId: '',
      Name: '',
      ParentId: parentId,
      Description: '',
      DisplayOrder: 0,
      CategoryType: type,
      CompanyType: 'Fashion',
      ImageUrl: '',
      PhoneBanner: '',
      IsDeleted: false,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1,
      Children: []
    };
  }
  toggleSetUpVariations() {
    if (this.product.ParentCategoryGuid) {
      const lookupName = this.categories && this.categories.find(x => x.CategoryId === this.product.ParentCategoryGuid);;
      this.product.ParentCategoryName = lookupName?.Name || '';
    }
    if (this.product.CategoryGuid) {
      this.product.CategoryName = this.categories && this.categories.find(x => x.CategoryId === this.product.CategoryGuid).Name;
    }
    this.productService.update(this.product).subscribe(res => {
      if (res && res.ProductId) {
        this.productService.updateProductState(res);
        this.router.navigate(['admin/dashboard/product-variations', this.product.ProductId]);
      }
    })
  }
  toggleShowOptionOnline(option: ProductVariationOption, showOnline: string) {
    option.ShowOnline = showOnline;
    this.productVariationService.updateProductVariationOption(option).subscribe(data => {
      console.log(data);

    })
  }

  delete() {
    if (confirm("Product will be moved trash, press ok to continue.")) {
      this.product.ProductStatus = STATUS_TRASHED_STRING;
      this.productService.update(this.product).subscribe(res => {
        if (res && res.ProductId) {
          this.productService.updateProductState(res);
          this.back();
        }
      })
    }

  }
  undelete() {
    if (confirm("Product will be moved out of trash to active, press ok to activate product.")) {
      this.product.ProductStatus = STATUS_ACTIIVE_STRING;
      this.productService.update(this.product).subscribe(res => {
        if (res && res.ProductId) {
          this.productService.updateProductState(res);
          // this.back();
          this.uxService.updateMessagePopState('Product is now active')
        }
      })
    }

  }

  copy() {

    let nav: any;
    nav = window.navigator;
    if (nav.share) {
      nav.share({
        title: 'Hello there!',
        text: `Check out this ${this.product.Name}`,
        url: this.productLink
        ,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      this.uxService.updateMessagePopState('Shop LinkCopied to clipboard.');
    }
  }
}
