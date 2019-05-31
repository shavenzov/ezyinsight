import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'ezy-stream-title',
  templateUrl: './stream-title.component.html',
  styleUrls: ['./stream-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StreamTitleComponent {

  /**
   * Stream source logo url
   */
  @Input()
  logoUrl;

}
