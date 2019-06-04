import {
  AppActions,
  AppState,
  ParamsChangedAction,
  StoriesRefreshEndAction,
  StoriesRefreshStartAction,
  ToolbarToggleAction
} from './app.actions';

export const initialState: AppState = {
  stories: null,
  refreshing: false,
  toolbarExpanded: false,
  params: {
    numCards: 8,
    autoRefresh: false,
    interval: 30
  }
}

export function appReducer( state: any = initialState, action: AppActions ): any {

  console.log( 'action', action, state );

  switch ( action.type ) {

    case ToolbarToggleAction.actionType:
      return {
        ...state,
        toolbarExpanded: action.payload
      };

    case ParamsChangedAction.actionType:
      return {
        ...state,
        params: {...action.payload}
      };

    case StoriesRefreshStartAction.actionType:
      return {
        ...state,
        refreshing: true
      };

    case StoriesRefreshEndAction.actionType:
      return {
        ...state,
        refreshing: false,
        stories: action.payload
      };

    default:
      return state;
  }
}
