import {Component} from '@angular/core';

@Component({
  selector: 'ezy-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  cards: any[] = new Array( 10 );
}
