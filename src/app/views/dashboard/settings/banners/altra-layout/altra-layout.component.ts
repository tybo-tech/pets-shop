import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { item, Item } from 'src/models/item.model';

@Component({
  selector: 'app-altra-layout',
  templateUrl: './altra-layout.component.html',
  styleUrls: ['./altra-layout.component.scss']
})
export class AltraLayoutComponent implements OnInit {
  @Input() item: Item;
  @Output() itemEvent: EventEmitter<Item> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }
  save() {
    this.itemEvent.emit(this.item);
  }
}
