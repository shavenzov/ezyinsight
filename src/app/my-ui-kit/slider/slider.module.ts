import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MySliderComponent } from './slider.component';
import { MySliderThumbDirective } from './slider-thumb.directive';

@NgModule({
  imports: [ CommonModule ],
  exports: [ MySliderComponent ],
  declarations: [ MySliderComponent, MySliderThumbDirective ]
})
export class MySliderModule {
}
