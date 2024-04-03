import { isDevMode } from '@angular/core';
import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { JobAdState, jobAdReducer } from './job-ad/job-ad.reducers';
import { JobAdEffects } from './job-ad/job-ad.effects';

export interface State {
  jobAd: JobAdState;
}

export const reducers: ActionReducerMap<State> = {
  jobAd: jobAdReducer
};

export const effects = [
  JobAdEffects
];

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
