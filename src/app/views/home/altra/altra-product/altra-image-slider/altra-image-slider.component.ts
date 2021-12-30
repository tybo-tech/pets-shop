import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Images } from 'src/models/images.model';

@Component({
  selector: 'app-altra-image-slider',
  templateUrl: './altra-image-slider.component.html',
  styleUrls: ['./altra-image-slider.component.scss'],
  animations: [
    trigger('fliInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-20%)', opacity: 0 }),
        animate('.5s')
      ]),
      transition(':leave', [
        animate('.5s', style({ transform: 'translateX(20%)', opacity: 0 }))
      ])
    ])
  ]
})
export class AltraImageSliderComponent implements OnInit {
  @Input() images: Images[];
  showImage: boolean;
  currentImage: Images;
  state: string;
  constructor() {
    this.load();
  }

  ngOnInit(): void {
    this.load();
  }
  toggle(image: Images) {
    this.currentImage = null;
    this.images.map(x => x.Class = [''])
    setTimeout(() => {
      this.currentImage = image;
      this.currentImage.Class = ['active'];
    }, 500)
    // this.showImage = true;
  }

  load() {
    if (this.images && this.images.length) {
      this.currentImage = this.images[0];
      this.currentImage.Class = ['active'];
    }
  }
  handleSwipe(direction) {
    const indexOfCurrent = this.images.indexOf(this.currentImage);
    if (direction === 'left') {
      const next = this.images[indexOfCurrent + 1];
      if (next)
        this.toggle(next);
      else
        this.toggle(this.images[0]);
    }
    if (direction === 'right') {
      const next = this.images[indexOfCurrent - 1];
      if (next)
        this.toggle(next);
      else
        this.toggle(this.images[this.images.length - 1]);
    }

  }
}
