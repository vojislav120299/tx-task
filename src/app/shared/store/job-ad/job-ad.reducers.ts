import { createReducer, on } from "@ngrx/store";
import { JobAd, JobAddFilter } from "@shared/models";
import {
  createJobAd,
  createJobAdFailure,
  createJobAdSuccess,
  deleteJobAd,
  deleteJobAdFailure,
  deleteJobAdSuccess,
  loadJobAds,
  loadJobAdsFailure,
  loadJobAdsSuccess,
  resetAddUpdateState,
  updateJobAd,
  updateJobAdFailure,
  updateJobAdSuccess
} from "./job-ad.actions";

export interface JobAdState {
  jobs: JobAd[];
  error: any;
  loading: boolean;
  filters: JobAddFilter | undefined;
  createJobAdSuccess: boolean;
  updateJobAdSuccess: boolean;
  deleteJobAdSuccess: boolean;
  createJobAdError: any;
  updateJobAdError: any;
  deleteJobAdError: any;
  createInvoice: boolean;
}

export const initialState: JobAdState = {
  jobs: [],
  error: null,
  loading: false,
  filters: {} as JobAddFilter,
  createJobAdSuccess: false,
  updateJobAdSuccess: false,
  deleteJobAdSuccess: false,
  createJobAdError: null,
  updateJobAdError: null,
  deleteJobAdError: null,
  createInvoice: false
};

export const jobAdReducer = createReducer(
  initialState,
  on(loadJobAds, (state, action) => ({ ...state, loading: true, error: null, filters: action.filters })),
  on(loadJobAdsSuccess, (state, action) => ({ ...state, jobs: action.jobAds, loading: false })),
  on(loadJobAdsFailure, (state, action) => ({ ...state, error: action.error, loading: false })),
  on(createJobAd, state => ({ ...state, createJobAdError: null })),
  on(createJobAdSuccess, state => ({ ...state, createJobAdSuccess: true })),
  on(createJobAdFailure, (state, action) => ({ ...state, createJobAdError: action.createJobAdError })),
  on(updateJobAd, state => ({ ...state, updateJobAdError: null })),
  on(updateJobAdSuccess, state => ({ ...state, updateJobAdSuccess: true })),
  on(updateJobAdFailure, (state, action) => ({ ...state, updateJobAdError: action.updateJobAdError })),
  on(deleteJobAd, state => ({ ...state, deleteJobAdError: null })),
  on(deleteJobAdSuccess, state => ({ ...state, deleteJobAdSuccess: true })),
  on(deleteJobAdFailure, (state, action) => ({ ...state, deleteJobAdError: action.deleteJobAdError })),
  on(resetAddUpdateState, state => ({
    ...state,
    createJobAdSuccess: false,
    updateJobAdSuccess: false,
    deleteJobAdSuccess: false,
    createJobAdError: null,
    updateJobAdError: null,
    deleteJobAdError: null
  }))
);
