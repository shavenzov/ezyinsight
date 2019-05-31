import {ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output} from '@angular/core';

@Component({
  selector: 'ezy-filters-button',
  templateUrl: './filters-button.component.html',
  styleUrls: ['./filters-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltersButtonComponent {

  @Input()
  active = false;

  @Output()
  activated: EventEmitter<boolean> = new EventEmitter();

  @HostListener('click')
  onClick(): void {
    this.active = ! this.active;
    this.activated.emit( this.active );
  }

}
