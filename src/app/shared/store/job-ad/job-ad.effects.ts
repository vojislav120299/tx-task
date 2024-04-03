import { Actions, createEffect, ofType } from "@ngrx/effects";
import { InvoicesService, JobAdService } from "../../services";
import { catchError, combineLatest, map, of, switchMap, withLatestFrom } from "rxjs";
import { Injectable } from "@angular/core";
import { exhaustMap } from "rxjs";
import { Store } from "@ngrx/store";
import { getJobsFilters, getJobsList, getJobsListFailure, getJobsListLoading } from "./job-ad.selector";
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
    updateJobAd,
    updateJobAdFailure,
    updateJobAdSuccess
} from "./job-ad.actions";
import { JobAd, JobAdDto, JobAdStatusEnum } from "@shared/models";

@Injectable()
export class JobAdEffects {

    private jobs$ = this.store.select(getJobsList);
    private jobsError$ = this.store.select(getJobsListFailure);
    private jobsLoading$ = this.store.select(getJobsListLoading);

    vm$ = combineLatest({
        jobs: this.jobs$,
        error: this.jobsError$,
        loading: this.jobsLoading$
    });

    /**
     *
     */
    constructor(
        private action$: Actions,
        private jobAdService: JobAdService,
        private store: Store,
        private invoiceService: InvoicesService
    ) { }

    /**
     * Load job ads effect
     */
    loadJobAds$ = createEffect(() =>
        this.action$.pipe(
            ofType(loadJobAds),
            exhaustMap((action) => {
                const filters = action.filters ?? {};
                return this.jobAdService.getJobAds(filters).pipe(
                    map(jobAds => loadJobAdsSuccess({ jobAds })),
                    catchError(error => of(loadJobAdsFailure({ error })))
                );
            })
        )
    );

    /**
     * Create job ad effect
     */
    createJobAd$ = createEffect(() =>
        this.action$.pipe(
            ofType(createJobAd),
            withLatestFrom(this.store.select(getJobsFilters)),
            exhaustMap(([action, filters]) => {
                return this.jobAdService.addJobAd(action.jobAd).pipe(
                    map((jobAd: JobAdDto) => {
                        const createAction = createJobAdSuccess({ jobAd });
                        this.store.dispatch(loadJobAds({ filters }));
                        if (jobAd.status === JobAdStatusEnum.Published) {
                            this.invoiceService.triggerNewInvoice.next(jobAd);
                        }
                        return createAction;
                    }),
                    catchError(error => of(createJobAdFailure({ createJobAdError: error })))
                );
            })
        )
    );





    /**
     * Update job ad effect
     */
    updateJobAd$ = createEffect(() =>
        this.action$.pipe(
            ofType(updateJobAd),
            withLatestFrom(this.store.select(getJobsFilters)),
            exhaustMap(([action, filters]) => {
                return this.jobAdService.updateJobAd(action.jobAd).pipe(
                    map((jobAd: JobAdDto) => {
                        const updateAction = updateJobAdSuccess({ jobAd });
                        this.store.dispatch(loadJobAds({ filters }));
                        if (jobAd.status === JobAdStatusEnum.Published && action.prevStatus === JobAdStatusEnum.Draft) {
                            this.invoiceService.triggerNewInvoice.next(jobAd);
                        }
                        return updateAction;
                    }),
                    catchError(error => of(updateJobAdFailure({ updateJobAdError: error }))
                    )
                );
            })
        )
    );

    /**
     * Delete job ad effect
     */
    deleteJobAd$ = createEffect(() =>
        this.action$.pipe(
            ofType(deleteJobAd),
            withLatestFrom(this.store.select(getJobsFilters)),
            exhaustMap(([action, filters]) => {
                return this.jobAdService.deleteJobAd(action.jobId).pipe(
                    map((jobAd: JobAdDto) => {
                        const deleteAction = deleteJobAdSuccess({ jobAd });
                        this.store.dispatch(loadJobAds({ filters }));
                        if (jobAd.status !== JobAdStatusEnum.Draft) {
                            this.invoiceService.triggerDeleteInvoice.next(jobAd);
                        }
                        return deleteAction;
                    }),
                    catchError(error => {
                        console.log(error)
                        return of(deleteJobAdFailure({ deleteJobAdError: error }))
                        }
                    ));
            })
        )
    );

}