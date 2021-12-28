import { Component, Input, OnInit } from '@angular/core';
import { OperatingHoursModel } from 'src/models/item.model';

@Component({
  selector: 'app-altra-operating-hours',
  templateUrl: './altra-operating-hours.component.html',
  styleUrls: ['./altra-operating-hours.component.scss']
})
export class AltraOperatingHoursComponent implements OnInit {
@Input() hours : OperatingHoursModel[]
  constructor() { }

  ngOnInit(): void {
  }

}
