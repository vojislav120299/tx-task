import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JobAd, JobAdDto, JobAddFilter } from "../models";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class JobAdService {
    /**
     *
     */
    constructor(private httpClient: HttpClient) {
    }

    /**
     * It gets job ads from the server.
     * @param filters
     * @returns Observable<JobAd[]>
     */
    getJobAds(filters: JobAddFilter): Observable<JobAd[]> {
        return this.httpClient.post<JobAd[]>('http://localhost:3000/jobs-filter', { filters });
    }

    /**
     * It adds a job ad to the server.
     * @param jobAd
     * @returns Observable<JobAdDto>
     */
    addJobAd(jobAd: JobAd): Observable<JobAdDto> {
        return this.httpClient.post<JobAdDto>('http://localhost:3000/jobs', jobAd);
    }

    /**
     * It updates a job ad on the server.
     * @param jobAd
     * @returns Observable<JobAdDto>
     */
    updateJobAd(jobAd: JobAd): Observable<JobAdDto> {
        return this.httpClient.put<JobAdDto>(`http://localhost:3000/jobs/${jobAd.id}`, jobAd);
    }

    /**
     * It deletes a job ad from the server.
     * @param id
     * @returns Observable<JobAdDto>
     */
    deleteJobAd(id: number): Observable<JobAdDto> {
        return this.httpClient.delete<JobAdDto>(`http://localhost:3000/jobs/${id}`);
    }

}