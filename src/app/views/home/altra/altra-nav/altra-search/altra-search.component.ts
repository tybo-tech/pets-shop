import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/models';
import { ProductService } from 'src/services';

@Component({
    selector: 'app-altra-search',
    templateUrl: 'altra-search.component.html',
    styleUrls: ['altra-search.component.scss']
})
export class AltraSearchComponent {
    searchString: string;
    products: Product[];
    showResult: boolean;
    @Input() styles;
    constructor(private productService: ProductService, private router: Router) { }
    search() {
        if (!this.searchString || !this.searchString.length) {
            this.products = [];
            this.showResult = false;
            return;
        }
        this.productService.search(this.searchString).subscribe(data => {
            this.products = data;
            this.showResult = true;
        })

    }

    open(product: Product) {
        this.showResult = false;
        this.searchString = undefined;
        this.router.navigate([`/products/${product.ProductId}`])
        // setTimeout(()=>{
        // },10)
    }
}
