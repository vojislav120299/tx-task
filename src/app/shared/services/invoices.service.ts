import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Invoice, JobAdDto } from "../models";
import { Observable, Subject } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { Store } from "@ngrx/store";
import { resetAddUpdateState } from "@shared/store/job-ad/job-ad.actions";

@Injectable({
    providedIn: 'root'
})
export class InvoicesService {
    triggerNewInvoice = new Subject<JobAdDto>();
    triggerNewInvoice$ = this.triggerNewInvoice.asObservable();

    triggerDeleteInvoice = new Subject<JobAdDto>();
    triggerDeleteInvoice$ = this.triggerDeleteInvoice.asObservable();

    /**
     *
     */
    constructor(
        private httpClient: HttpClient,
        private toast: ToastrService,
        private store: Store
    ) {   
        this.triggerNewInvoice$.subscribe(jobAd => {
            if (jobAd) {
                this.createInvoice(jobAd).subscribe(() => {
                    this.toast.success(`Invoice created for job: ${jobAd.title}`);
                })
            }
        });

        this.triggerDeleteInvoice$.subscribe(jobAd => {
            if (jobAd) {
                this.deleteInvoice(jobAd.id).subscribe(() => {
                    this.toast.success(`Invoice deleted for job: ${jobAd.title}`);
                })
            }
        });
    }

    /**
     * It gets invoices.
     * @returns Observable<Invoices[]>
     */
    getInvoices(): Observable<Invoice[]> {
        return this.httpClient.get<Invoice[]>('http://localhost:3000/invoices');
    }

    /**
     * It creates an invoice for a job ad.
     * @param jobAd
     * @returns Observable<Invoice>
     */
    createInvoice(jobAd: JobAdDto): Observable<Invoice> {
        const dueDateString = jobAd.updatedAt ?? jobAd.createdAt;
        const invoice = {
            id: new Date().getTime(),
            jobAdId: jobAd.id,
            amount: Math.floor(Math.random() * 1000) + 500,
            dueDate: this.calculateDueDate(new Date(dueDateString).toISOString())
        } as Invoice;

        return this.httpClient.post<Invoice>('http://localhost:3000/invoices', invoice);
    }

    /**
     * It deletes an invoice for a job ad.
     * @param jobId
     * @returns Observable<Invoice>
     */
    deleteInvoice(jobId: number): Observable<Invoice> {
        return this.httpClient.delete<Invoice>(`http://localhost:3000/invoices/${jobId}`);
    }

    /**
     * It calculates the due date of the invoice.
     * @param publishedDate
     * @returns Date
     */
    calculateDueDate(publishedDate: string): Date {
        const dueDate = new Date(publishedDate);
        dueDate.setMonth(dueDate.getMonth() + 2);
        dueDate.setDate(30);
        return dueDate;
    }
}