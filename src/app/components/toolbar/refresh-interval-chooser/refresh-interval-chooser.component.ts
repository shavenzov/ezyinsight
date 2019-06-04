import {Component, EventEmitter, Input, Output} from '@angular/core';

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
  paramsChange: EventEmitter<void> = new EventEmitter();

  @Output()
  refreshClick: EventEmitter<void> = new EventEmitter();

  paramChanged(): void {
    this.paramsChange.emit();
  }

  refreshButtonClick(): void {
    this.refreshClick.emit();
  }

}
