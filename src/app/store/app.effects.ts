import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {ParamsChangedAction, StoriesStreamChangedAction} from './app.actions';
import {mergeMap, switchMap} from 'rxjs/operators';
import {EzyinsightService} from '../services/ezyinsight.service';
import {Observable, timer} from 'rxjs';
import {EzyStoryModel} from '../services/models/story.model';

@Injectable()
export class StoriesEffects {

  @Effect()
  storiesRefresh = this.actions.pipe(
    ofType( ParamsChangedAction.actionType ),
    mergeMap( ( action: ParamsChangedAction ) => [
        new StoriesStreamChangedAction( this.getStoriesStream( action.payload.numCards, action.payload.interval, action.payload.interval ) )
      ] )
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
