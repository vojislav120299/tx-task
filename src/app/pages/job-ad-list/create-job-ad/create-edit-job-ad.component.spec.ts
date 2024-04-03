import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditJobAdComponent } from './create-edit-job-ad.component';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormArray, FormControl } from '@angular/forms';
import { JobAd, JobAdStatusEnum } from '@shared/models';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { initialState, jobAdReducer } from '@shared/store/job-ad/job-ad.reducers';
import { createJobAd, updateJobAd } from '@shared/store/job-ad/job-ad.actions';
import { JobAdEffects } from '@shared/store/job-ad/job-ad.effects';
describe('CreateEditAdComponent', () => {
  let component: CreateEditJobAdComponent;
  let fixture: ComponentFixture<CreateEditJobAdComponent>;
  let mockToast: any;
  let store: MockStore;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CreateEditJobAdComponent,
        StoreModule.forRoot({jobAdReducer}),
        EffectsModule.forRoot([JobAdEffects]),
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ToastrService, useValue: mockToast },
        { provide: MAT_DIALOG_DATA, useValue: { } },
        provideMockStore({initialState}),
      ]
    })
      .compileComponents();
    store = TestBed.inject(MockStore);
    mockToast = jasmine.createSpyObj('ToastrService', ['success']);
    fixture = TestBed.createComponent(CreateEditJobAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create job ad', () => {
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    component.isEdit = false;
  
    // Get the skills FormArray
    const skillsArray = <FormArray>component.createJobAdForm.get('skills');
    
    while (skillsArray.length !== 0) {
      skillsArray.removeAt(0);
    }
  
    // Add a control for each skill
    ['skill1', 'skill2'].forEach(skill => skillsArray.push(new FormControl(skill)));
  
    component.createJobAdForm.setValue({
      id: 1,
      title: 'title',
      description: 'description',
      skills: ['skill1', 'skill2'],
      status: 'status'
    });
  
    component.submit();
    expect(dispatchSpy).toHaveBeenCalledWith(createJobAd({ jobAd: component.createJobAdForm.getRawValue() }));
  });

  it('should update job ad', () => {
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    component.isEdit = true;
    component.data.jobAd = {
      id: 1,
      title: 'title',
      description: 'description',
      skills: ['skill1', 'skill2'],
      status: JobAdStatusEnum.Draft
    }
  
    // Get the skills FormArray
    const skillsArray = <FormArray>component.createJobAdForm.get('skills');
    
    while (skillsArray.length !== 0) {
      skillsArray.removeAt(0);
    }
  
    // Add a control for each skill
    ['skill1', 'skill2'].forEach(skill => skillsArray.push(new FormControl(skill)));
  
    component.createJobAdForm.setValue(
      component.data.jobAd
    );
  
    component.submit();
    expect(dispatchSpy).toHaveBeenCalledWith(updateJobAd({
      jobAd: component.createJobAdForm.getRawValue(),
      prevStatus: JobAdStatusEnum.Draft
    }));
  });

  it('should bind form with supplied data', () => {
    const jobAd = {
      id: 1,
      title: 'Test',
      description: 'Test description',
      skills: ['Skill1', 'Skill2'],
      status: 'published'
    } as JobAd;
    component.bindForm(jobAd);

    expect(component.createJobAdForm.getRawValue()).toEqual(jobAd);
  });
});
