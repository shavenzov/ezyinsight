import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState, ParamsChangedAction} from './store/app.actions';
import {initialState} from './store/app.reducers';

@Component({
  selector: 'ezy-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  appState: Observable<AppState>;

  constructor(
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this.appState = this.store.select( 'appStore' );
  }

  onClick(): void {

  }
}
