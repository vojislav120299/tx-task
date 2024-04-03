import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { jobAdStatuses } from '../../../app.globals';
import { CreateUpdateJobModalData, JobAd, JobAdStatusEnum } from '@shared/models';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { createJobAd, resetAddUpdateState, updateJobAd } from '@shared/store/job-ad/job-ad.actions';
import {
  getCreateJobFailure,
  getCreateJobSuccess,
  getUpdateJobFailure,
  getUpdateJobSuccess
} from '@shared/store/job-ad/job-ad.selector';
@Component({
  selector: 'app-create-edit-job-ad',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    ToastrModule
  ],
  templateUrl: './create-edit-job-ad.component.html',
  styleUrl: './create-edit-job-ad.component.scss'
})
export class CreateEditJobAdComponent {
  createJobAdForm: FormGroup;
  isEdit: boolean;
  statuses = jobAdStatuses;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: CreateUpdateJobModalData,
  ) {
    this.store.dispatch(resetAddUpdateState());
    this.isEdit = data && data.isEdit;
    if (data && data.jobAd) {
      this.filterStatuses(data.jobAd);
    }
    this.bindForm(data.jobAd);
    this.handleSubmitMessages();
  }

  // getters
  get title() {
    return this.createJobAdForm.get('title');
  }

  get description() {
    return this.createJobAdForm.get('description');
  }

  get skills(): FormArray {
    return this.createJobAdForm.get('skills') as FormArray;
  }

  get status() {
    return this.createJobAdForm.get('status');
  }

  /**
   * It will handle submit and error messages when creating and updating job ad.
   */
  handleSubmitMessages() {
    const successSelector = this.isEdit ? getUpdateJobSuccess : getCreateJobSuccess;
    const successMessage = this.isEdit ? 'Successfully Updated Job Ad' : 'Successfully Created Job Ad';
    const failureSelector = this.isEdit ? getUpdateJobFailure : getCreateJobFailure;
    const failureMessage = this.isEdit ? 'There was a problem when updating Job Ad!' : 'There was a problem when creating Job Ad!';
    this.store.select(successSelector).pipe(takeUntilDestroyed()).subscribe((success: boolean) => {
      if (success) {
        this.toast.success(successMessage);
      }
    });
    this.store.select(failureSelector).pipe(takeUntilDestroyed()).subscribe((error: any) => {
      if (error) {
        this.toast.error(failureMessage);
      }
    });
  }

  /**
   * It will filter statuses based on the job ad status.
   * @param jobAd JobAd
   */
  filterStatuses(jobAd: JobAd) {
    this.statuses = this.statuses.filter(status =>
      status === jobAd.status ||
      (jobAd.status === JobAdStatusEnum.Draft && status === JobAdStatusEnum.Published) ||
      (jobAd.status === JobAdStatusEnum.Published && status === JobAdStatusEnum.Archived)
    );
  }

  /**
   * It binds the form with the data.
   * @param data JobAd
   */
  bindForm(data: JobAd = {} as JobAd) {
    this.createJobAdForm = this.fb.group({
      id: new FormControl(data?.id),
      title: new FormControl(data?.title, [Validators.required]),
      description: new FormControl(data?.description, [Validators.required]),
      status: new FormControl(data?.status),
      skills: this.fb.array([])
    });
    if (data?.skills?.length > 0) {
      data.skills.forEach(el => this.addNewSkillInput(el))
    } else {
      this.createJobAdForm.setControl('skills', this.fb.array([
        this.fb.control('', [Validators.required])
      ]));
    }
  }

  /**
   * It will submit the form.
   */
  submit() {
    if (!this.createJobAdForm.valid) {
      this.createJobAdForm.markAllAsTouched();
      return;
    }
    const filteredSkills = this.skills.value.filter((skill: string) => skill);
    const skillControls = filteredSkills.map((skill: any) => this.fb.control(skill));
    this.createJobAdForm.setControl('skills', this.fb.array(skillControls));
    const jobAd = this.createJobAdForm.getRawValue();
    const action = this.isEdit ? updateJobAd({ jobAd, prevStatus: this.data.jobAd.status }) : createJobAd({ jobAd });
    this.store.dispatch(action);
  }

  /**
   * It will add new skill input.
   * @param value string
   */
  addNewSkillInput(value: string = '') {
    const validators = [] as Validators[];
    if (this.skills) {
      if (this.skills.length === 0) {
        validators.push(Validators.required);
      }
      this.skills.push(this.fb.control(value, validators[0]));
    }
  }

  /**
   * It will remove skill input.
   * @param index number
   */
  removeSkillInput(index: number) {
    if (this.skills) {
      this.skills.removeAt(index);
    }
  }
}
