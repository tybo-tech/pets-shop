import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { allStyles, DictionaryModel } from 'src/shared/ngstyle.model';

@Component({
  selector: 'app-altra-ng-style',
  templateUrl: './altra-ng-style.component.html',
  styleUrls: ['./altra-ng-style.component.scss']
})
export class AltraNgStyleComponent implements OnInit {
  @Input() styleItems: DictionaryModel[];
  @Output() ngStyleEvent: EventEmitter<DictionaryModel[]> = new EventEmitter();
  allStyles: DictionaryModel[] = allStyles;
  constructor() { }

  ngOnInit(): void {
  }
  save() {
    this.ngStyleEvent.emit(this.styleItems);
  }
  add() {
    this.styleItems.push({ Key: 'background', Value: '#303133', Label: 'Background', InputType: 'text' })
    this.save();
  }
  delete(i: number) {
    this.styleItems.splice(i, 1);
    this.save();
  }
}
