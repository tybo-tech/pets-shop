import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-qty-btn',
  templateUrl: './qty-btn.component.html',
  styleUrls: ['./qty-btn.component.scss']
})
export class QtyBtnComponent implements OnInit {
  @Input() val: number;
  @Input() max: number;
  @Input() min: number = 1;
  @Output() qtyEvent: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
    this.val = Number(this.val);
    this.max = Number(this.max);
    this.min = Number(this.min);
  }
  qtyChanged(qty) {
    if (this.val >= this.max && Number(qty) === 1)
      return

    if (this.val <= this.min && Number(qty) === -1)
      return
    this.val += Number(qty);
    this.qtyEvent.emit(this.val)
  }
}
