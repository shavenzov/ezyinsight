import {Component, OnInit, ViewChild} from '@angular/core';
import {AppState, ParamsChangedAction, StoriesRefreshStartAction, ToolbarToggleAction} from '../../store/app.actions';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {NumCardsChooserComponent} from './num-cards-chooser/num-cards-chooser.component';
import {RefreshIntervalChooserComponent} from './refresh-interval-chooser/refresh-interval-chooser.component';

@Component({
  selector: 'ezy-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @ViewChild( 'cardChooser', { read: NumCardsChooserComponent, static: false } )
  cardChooser: NumCardsChooserComponent;

  @ViewChild( 'intervalChooser', { read: RefreshIntervalChooserComponent, static: false } )
  intervalChooser: RefreshIntervalChooserComponent;

  appState: Observable<AppState>;

  constructor(
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.appState = this.store.select( 'appStore' );
  }

  changePanelState( value: boolean ): void {
    this.store.dispatch( new ToolbarToggleAction( value ) );
  }

  paramsChanged(): void {
   this.store.dispatch( new ParamsChangedAction( {
      numCards: this.cardChooser.selection,
      autoRefresh: this.intervalChooser.autoRefresh,
      interval: this.intervalChooser.refreshInterval
   } ) );
  }

  refreshClick(): void {
    this.store.dispatch( new StoriesRefreshStartAction() );
  }

}
