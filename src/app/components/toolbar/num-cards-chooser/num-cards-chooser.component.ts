import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'ezy-num-cards-chooser',
  templateUrl: './num-cards-chooser.component.html',
  styleUrls: ['./num-cards-chooser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumCardsChooserComponent  {

 options: number[] = [ 10, 20, 30 ];
 optionIndex = 1;

}
