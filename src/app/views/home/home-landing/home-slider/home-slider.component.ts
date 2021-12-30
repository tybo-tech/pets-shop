import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { Item } from 'src/models/item.model';
import { ItemService } from 'src/services/item.service';
import { ITEM_TYPES } from 'src/shared/constants';

@Component({
  selector: 'app-home-slider',
  templateUrl: './home-slider.component.html',
  styleUrls: ['./home-slider.component.scss']
})
export class HomeSliderComponent implements OnInit {
  slide = 0;
  maxSlideNumber: number;
  thisClass: string;
  size = 1000;
  $timer: any;


  banner1: Item;
  banner2: Item;
  banner3: Item;
  banner4: Item;
  banner5: Item;
  banner6: Item;
  banner7: Item;

  bannerMobile1: Item;
  bannerMobile2: Item;
  bannerMobile3: Item;
  bannerMobile4: Item;

  constructor(
    private router: Router,
    private itemService: ItemService,
  ) { }

  ngOnInit() {
    this.itemService.ItemListObservable.subscribe(data => {
      if (data && data.length) {
        this.banner1 = data.find(x => x.ItemType === ITEM_TYPES.BANNER1.Name);
        this.banner2 = data.find(x => x.ItemType === ITEM_TYPES.BANNER2.Name);
        this.banner3 = data.find(x => x.ItemType === ITEM_TYPES.BANNER3.Name);
        this.banner4 = data.find(x => x.ItemType === ITEM_TYPES.BANNER4.Name);
        this.banner4 = data.find(x => x.ItemType === ITEM_TYPES.BANNER4.Name);

        this.bannerMobile1 = data.find(x => x.ItemType === ITEM_TYPES.MOBILE_BANNER1.Name);
        this.bannerMobile2 = data.find(x => x.ItemType === ITEM_TYPES.MOBILE_BANNER2.Name);
        this.bannerMobile3 = data.find(x => x.ItemType === ITEM_TYPES.MOBILE_BANNER3.Name);
        this.bannerMobile4 = data.find(x => x.ItemType === ITEM_TYPES.MOBILE_BANNER4.Name);
      }

    })
  }



  selectCategory(category: string) {
    this.router.navigate([`/collections/${category}`])
  }
  goto(url) {
    this.router.navigate([url])
  }
  viewImage(e) { }
}
