import {Component} from '@angular/core';

@Component({
  selector: 'ezy-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  panelExpanded = true;



  changePanelState( value: boolean ): void {
    this.panelExpanded = value;
  }

}
