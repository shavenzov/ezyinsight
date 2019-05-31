import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[mySliderThumb]'
})
export class MySliderThumbDirective {
  /**
   * Preventing browser element dragging
   */
  @HostListener('mousedown')
  onMouseDown(): boolean {
    return false;
  }
}
