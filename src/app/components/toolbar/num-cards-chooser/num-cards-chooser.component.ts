import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'ezy-num-cards-chooser',
  templateUrl: './num-cards-chooser.component.html',
  styleUrls: ['./num-cards-chooser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumCardsChooserComponent {

 @Input()
 options: number[] = [ 10, 20, 30 ];

 @Input()
 selection = 20;

 @Output()
 selectionChange: EventEmitter<number> = new EventEmitter();

 onChange(): void {
  this.selectionChange.emit( this.selection );
 }

}
