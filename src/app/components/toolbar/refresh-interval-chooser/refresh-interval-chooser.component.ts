import {Component, Input, EventEmitter, Output} from '@angular/core';
import {MySliderValue} from '../../../my-ui-kit/slider/slider.types';

@Component({
  selector: 'ezy-refresh-interval-chooser',
  templateUrl: './refresh-interval-chooser.component.html',
  styleUrls: ['./refresh-interval-chooser.component.scss']
})
export class RefreshIntervalChooserComponent {

  @Input()
  refreshing = false;

  @Input()
  autoRefresh = true;

  @Input()
  refreshInterval = 30;

  @Input()
  minInterval = 15;

  @Input()
  maxInterval = 60;

  @Input()
  step = 15;

  @Output()
  intervalChanged: EventEmitter<number> = new EventEmitter();

  @Output()
  autoRefreshChanged: EventEmitter<boolean> = new EventEmitter();

  @Output()
  refreshButtonClick: EventEmitter<void> = new EventEmitter();

  onIntervalInput( value: MySliderValue ): void {
    this.intervalChanged.emit(  value as number );
  }

  onAutoRefreshChanged(): void {
    this.autoRefreshChanged.emit( this.autoRefresh );
  }

  onRefreshButtonClick(): void {
    this.refreshButtonClick.emit();
  }

}
