import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {ParamsChangedAction, StoriesRefreshEndAction} from './app.actions';
import {map, switchMap} from 'rxjs/operators';
import {EzyinsightService} from '../services/ezyinsight.service';
import {Observable, of, timer} from 'rxjs';
import {EzyStoryModel} from '../services/models/story.model';

@Injectable()
export class StoriesEffects {

  @Effect()
  storiesRefresh = this.actions.pipe(
    ofType( ParamsChangedAction.actionType ),
    switchMap( ( action: ParamsChangedAction ) => action.payload.autoRefresh ?
      this.getStoriesStream( action.payload.numCards, action.payload.interval, action.payload.interval ) : of( null ) ),
    map( ( stories: EzyStoryModel[] ) => new StoriesRefreshEndAction( stories ) )
  );

  constructor(
    private actions: Actions,
    private ezyService: EzyinsightService
  ) {}

  private getStoriesStream( limit: number, refreshInterval: number, delay: number = 0 ): Observable<EzyStoryModel[]> {
    return timer( delay * 1000, refreshInterval * 1000 ).pipe(
      switchMap( () => this.ezyService.getStories( limit ) )
    );
  }

}
