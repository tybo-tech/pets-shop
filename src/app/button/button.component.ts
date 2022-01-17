import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item } from 'src/models/item.model';
import { ItemService } from 'src/services/item.service';
import { ITEM_TYPES } from 'src/shared/constants';
import { DictionaryModel, initNavTheme } from 'src/shared/ngstyle.model';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() label: string
  @Input() input: any;
  @Input() btnClass: any;
  @Input() type = 'primary';
  @Input() isDisabled: boolean;

  @Output() primaryButtonEvent: EventEmitter<any> = new EventEmitter();
  websiteColorsItem: Item;
  secondaryNavigationStyles: DictionaryModel[] = initNavTheme;
  primaryButtonStyles: DictionaryModel[] = initNavTheme;
  primaryNgStyle = {};
  secondaryNgStyle = {};
  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    // alert(this.label)
    this.itemService.ItemListObservable.subscribe(data => {
      if (data && data.length)
        this.websiteColorsItem = data.find(x => x.ItemType === ITEM_TYPES.WEBSITE_COLORS.Name);
      if (this.websiteColorsItem) {
        this.formatDataOnLoad();
      }
    })
  }

  formatDataOnLoad() {
    // Nan Theme
    if (this.websiteColorsItem.Name && this.websiteColorsItem.Name.length > 15) {
      this.primaryButtonStyles = JSON.parse(this.websiteColorsItem.Name);
    }

    if (this.websiteColorsItem.Description && this.websiteColorsItem.Description.length > 15) {
      this.secondaryNavigationStyles = JSON.parse(this.websiteColorsItem.Description);
    }


    this.primaryButtonStyles.forEach(item => {
      this.primaryNgStyle[item.Key] = item.Value
    });

    this.secondaryNavigationStyles.forEach(item => {
      this.secondaryNgStyle[item.Key] = item.Value
    });



  }
  clicked() {
    this.primaryButtonEvent.emit(this.input);
  }
}
