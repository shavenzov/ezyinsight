import {Component, Input} from '@angular/core';

@Component({
  selector: 'ezy-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {

  /**
   * News image url
   */
  @Input()
  imageUrl;

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
  header;

}
