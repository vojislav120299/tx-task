import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { CreateEditJobAdComponent } from './create-job-ad/create-edit-job-ad.component';
import { jobAdStatuses } from '../../app.globals';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CreateUpdateJobModalData, JobAd } from '@shared/models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { JobAdEffects } from '@shared/store/job-ad/job-ad.effects';
import { deleteJobAd, loadJobAds, resetAddUpdateState } from '@shared/store/job-ad/job-ad.actions';
import {
  getCreateJobSuccess,
  getDeleteJobAdFailure,
  getDeleteJobAdSuccess,
  getUpdateJobSuccess
} from '@shared/store/job-ad/job-ad.selector';

@Component({
  selector: 'app-job-ad-list',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    CreateEditJobAdComponent,
    ToastrModule
  ],
  templateUrl: './job-ad-list.component.html',
  styleUrl: './job-ad-list.component.scss'
})
export class JobAdListComponent implements OnInit {
  vm$ = this.jobsEffects.vm$;
  getCreateJobSuccess$ = getCreateJobSuccess;

  columns = ['title', 'description', 'skills', 'status', 'actions']
  filtersForm: FormGroup;

  statuses = jobAdStatuses;
  constructor(
    private jobsEffects: JobAdEffects,
    private store: Store,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private toast: ToastrService
  ) {
    this.store.dispatch(resetAddUpdateState());

    this.filtersForm = this.fb.group({
      title: new FormControl(null),
      description: new FormControl(null),
      skill: new FormControl(null),
      status: new FormControl(null),
    });

    // handle create job success
    this.store.select(getCreateJobSuccess).pipe(takeUntilDestroyed()).subscribe((success: boolean) => {
      if (success) {
        this.dialog.closeAll();
      }
    });
    this.store.select(getUpdateJobSuccess).pipe(takeUntilDestroyed()).subscribe((success: boolean) => {
      if (success) {
        this.dialog.closeAll();
      }
    });
    this.store.select(getDeleteJobAdSuccess).pipe(takeUntilDestroyed()).subscribe((success: boolean) => {
      this.store.dispatch(resetAddUpdateState());
      if (success) {
        this.toast.success('Job deleted successfully');
      }
    });
    this.store.select(getDeleteJobAdFailure).pipe(takeUntilDestroyed()).subscribe((error: any) => {
      this.store.dispatch(resetAddUpdateState());
      if (error) {
        this.toast.error('Job deletion failed');
      }
    });
  }

  ngOnInit(): void {
    this.store.dispatch(loadJobAds({ filters: {} }));
  }

  /**
   * It will apply filters to the job ads.
   */
  applyFilters() {
    const filters = this.filtersForm.getRawValue();
    this.store.dispatch(loadJobAds({ filters }));
  }

  /**
   * It will reset the filters and load all job ads.
   */
  resetFilters() {
    this.filtersForm.reset();
    this.store.dispatch(loadJobAds({ filters: {} }));
  }

  /**
   * It will open the dialog to add or edit the job ad.
   * @param isEdit boolean
   * @param jobAd JobAd
   */
  openAddJobDialog(isEdit = false, jobAd?: JobAd) {
    this.dialog.open(CreateEditJobAdComponent, {
      data: {
        isEdit,
        jobAd
      } as CreateUpdateJobModalData
    });
  }

  /**
   * It will delete the job ad.
   * @param jobId number
   */
  deleteJob(jobId: number) {
    this.store.dispatch(deleteJobAd({ jobId }));
  }
}
