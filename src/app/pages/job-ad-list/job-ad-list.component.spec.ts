import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobAdListComponent } from './job-ad-list.component';
import { Store, StoreModule } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { EffectsModule } from '@ngrx/effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initialState, jobAdReducer } from '@shared/store/job-ad/job-ad.reducers';
import { JobAdEffects } from '@shared/store/job-ad/job-ad.effects';
import { deleteJobAd, loadJobAds } from '@shared/store/job-ad/job-ad.actions';
describe('JobAdListComponent', () => {
  let component: JobAdListComponent;
  let fixture: ComponentFixture<JobAdListComponent>;
  let mockDialog: any;
  let mockToast: any;
  let store: MockStore;
  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: () => '123' // represents the 'id' parameter
      }
    }
  };

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
    mockToast = jasmine.createSpyObj('ToastrService', ['success']);
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({jobAdReducer}),
        EffectsModule.forRoot([JobAdEffects]),
        BrowserAnimationsModule,
        JobAdListComponent
      ],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: ToastrService, useValue: mockToast },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideMockStore({initialState}),
        FormBuilder
      ]
    })
    .compileComponents();
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(JobAdListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delete job ad', () => {
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough(); // spy on the store
    const jobId = 1; 
    component.deleteJob(jobId);
    expect(dispatchSpy).toHaveBeenCalledWith(deleteJobAd({ jobId }));
  })

  it('should call load jobs on init', () => {
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough(); // spy on the store 
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(loadJobAds({ filters: {} }));
  });

  it('should apply filters', () => {
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough(); // spy on the store 
    component.applyFilters();
    expect(dispatchSpy).toHaveBeenCalledWith(loadJobAds({ filters: component.filtersForm.getRawValue() }));
  });

  it('should reset filters', () => {
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough(); // spy on the store 
    component.resetFilters();
    const resetFilters = {
      title: null,
      description: null,
      skill: null,
      status: null
    };
    expect(component.filtersForm.getRawValue()).toEqual(resetFilters);
    expect(dispatchSpy).toHaveBeenCalledWith(loadJobAds({ filters: {} }));
  });
});
