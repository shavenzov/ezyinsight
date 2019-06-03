import {Observable} from 'rxjs';
import {EzyStoryModel} from '../services/models/story.model';
import {Action} from '@ngrx/store';

export type AppParams = {
  numCards?: number;
  autoRefresh?: boolean;
  interval?: number;
};

export type AppState = {
  stories: Observable<EzyStoryModel[]>;
  refreshing: boolean;
  toolbarExpanded: boolean;
  params: AppParams;
};

export class ToolbarToggleAction implements Action {
  static readonly actionType = 'ToolbarToggle';
  readonly type = ToolbarToggleAction.actionType;

  constructor(
    public payload: boolean
  ) {}
}

export class ParamsChangedAction implements Action {
  static readonly actionType = 'ParamsChanged';
  readonly type = ParamsChangedAction.actionType;

  constructor(
    public payload: AppParams
  ) {}
}

export class StoriesRefreshStartAction implements Action {
  static readonly actionType = 'StoriesRefreshStart';
  readonly type = StoriesRefreshStartAction.actionType;
}

export class StoriesRefreshEndAction implements Action {
  static readonly actionType = 'StoriesRefreshEnd';
  readonly type = StoriesRefreshEndAction.actionType;
}

export class StoriesStreamChangedAction implements Action {
  static readonly actionType = 'StoriesStreamChanged';
  readonly type = StoriesStreamChangedAction.actionType;

  constructor(
    public payload: Observable<EzyStoryModel[]>
  ) {}
}

export type AppActions = ToolbarToggleAction |
                         ParamsChangedAction |
                         StoriesRefreshStartAction |
                         StoriesRefreshEndAction |
                         StoriesStreamChangedAction;
