import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {
  AppState,
  ParamsChangedAction,
  StoriesRefreshEndAction,
  StoriesRefreshStartAction,
  StoriesTimerStartAction,
  StoriesTimerStopAction
} from './app.actions';
import {map, switchMap, withLatestFrom} from 'rxjs/operators';
import {EzyinsightService} from '../services/ezyinsight.service';
import {of, timer} from 'rxjs';
import {Store} from '@ngrx/store';

@Injectable()
export class StoriesEffects {

  @Effect()
  storiesTimer$ = this.actions.pipe(
    ofType( StoriesTimerStartAction.actionType, ParamsChangedAction.actionType ),
    withLatestFrom( this.store.select( 'appStore' ) ),
    switchMap( ( [ action, state ] ) => {

       // create timer
       if ( state.params.autoRefresh ) {
         const interval = state.params.interval * 1000;
         return timer( interval, interval );
       }

       // mark timer as disabled
       return of( null );
      }
     ),
    map( ( value ) => {
        if (value === null) {
          return new StoriesTimerStopAction();
        }

        return new StoriesRefreshStartAction();
      }
    )
  );

  @Effect()
  storiesRefresh$ = this.actions.pipe(
    ofType( StoriesRefreshStartAction.actionType ),
    withLatestFrom( this.store.select( 'appStore' ) ),
    switchMap( ( [ action, state ] ) => this.ezyService.getStories( state.params.numCards ) ),
    map( ( stories ) => new StoriesRefreshEndAction( stories ) )
  );

  constructor(
    private actions: Actions,
    private ezyService: EzyinsightService,
    private store: Store<AppState>
  ) {}

}
