import { createAction, props } from '@ngrx/store';
import { JobAd, JobAdDto, JobAdStatus, JobAddFilter, UpdateJobStatusModel } from '../../models';

export const loadJobAds = createAction('[JobAd] Load JobAds', props<{ filters?: JobAddFilter }>());
export const loadJobAdsSuccess = createAction('[JobAd] Load JobAds Success', props<{ jobAds: JobAd[] }>());
export const loadJobAdsFailure = createAction('[JobAd] Load JobAds Failure', props<{ error: any }>());

export const createJobAd = createAction('[JobAd] Create JobAd', props<{ jobAd: JobAd }>());
export const createJobAdSuccess = createAction('[JobAd] Create JobAd Success', props<{ jobAd: JobAdDto }>());
export const createJobAdFailure = createAction('[JobAd] Create JobAd Failure', props<{ createJobAdError: any }>());

export const updateJobAd = createAction('[JobAd] Update JobAd', props<UpdateJobStatusModel>());
export const updateJobAdSuccess = createAction('[JobAd] Update JobAd Success', props<{ jobAd: JobAdDto }>());
export const updateJobAdFailure = createAction('[JobAd] Update JobAd Failure', props<{ updateJobAdError: any }>());

export const deleteJobAd = createAction('[JobAd] Delete JobAd', props<{ jobId: number }>());
export const deleteJobAdSuccess = createAction('[JobAd] Delete JobAd Success', props<{ jobAd: JobAdDto }>());
export const deleteJobAdFailure = createAction('[JobAd] Delete JobAd Failure', props<{ deleteJobAdError: any }>());

export const resetAddUpdateState = createAction('[JobAd] Reset Add Update State');