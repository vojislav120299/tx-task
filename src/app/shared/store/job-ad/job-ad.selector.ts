import { createFeatureSelector, createSelector } from "@ngrx/store";
import { JobAdState } from "./job-ad.reducers";

const getJobsState = createFeatureSelector<JobAdState>('jobAd');

// Jobs list
export const getJobsList = createSelector(getJobsState, (state: JobAdState) => state.jobs);

export const getJobsListFailure = createSelector(getJobsState, (state: JobAdState) => state.error);

export const getJobsListSuccess = createSelector(getJobsState, (state: JobAdState) => state.jobs);

export const getJobsListLoading = createSelector(getJobsState, (state: JobAdState) => state.loading);

export const getJobsFilters = createSelector(getJobsState, (state: JobAdState) => state.filters);

// Create Job
export const getCreateJobFailure = createSelector(getJobsState, (state: JobAdState) => state.createJobAdError);

export const getCreateJobSuccess = createSelector(getJobsState, (state: JobAdState) => state.createJobAdSuccess);

// Update Job
export const getUpdateJobFailure = createSelector(getJobsState, (state: JobAdState) => state.updateJobAdError);

export const getUpdateJobSuccess = createSelector(getJobsState, (state: JobAdState) => state.updateJobAdSuccess);

// Delete Job
export const getDeleteJobAdFailure = createSelector(getJobsState, (state: JobAdState) => state.deleteJobAdError);

export const getDeleteJobAdSuccess = createSelector(getJobsState, (state: JobAdState) => state.deleteJobAdSuccess);
