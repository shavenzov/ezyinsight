import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'ezy-refresh-interval-chooser',
  templateUrl: './refresh-interval-chooser.component.html',
  styleUrls: ['./refresh-interval-chooser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RefreshIntervalChooserComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
