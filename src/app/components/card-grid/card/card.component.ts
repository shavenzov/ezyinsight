import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'ezy-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {

  /**
   * News image url
   */
  @Input()
  pictureUrl;

  /**
   * Stream source logo url
   */
  @Input()
  streamLogoUrl;

  /**
   * Stream source name
   */
  @Input()
  streamName;

  /**
   * News title text
   */
  @Input()
  headline;

}
