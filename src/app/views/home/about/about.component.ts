import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Item } from 'src/models/item.model';
import { ItemService } from 'src/services/item.service';
import { ITEM_TYPES } from 'src/shared/constants';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AboutComponent implements OnInit {
  aboutUs:Item;
  aboutUsImage: Item;

  constructor(    private itemService: ItemService,
    ) { }

  ngOnInit() {
    this.itemService.ItemListObservable.subscribe(data => {
      if (data && data.length)
        this.aboutUs = data.find(x => x.ItemType === ITEM_TYPES.ABOUT.Name);
        this.aboutUsImage = data.find(x => x.ItemType === ITEM_TYPES.ABOUT_IMAGE.Name);

    })
  }

}
