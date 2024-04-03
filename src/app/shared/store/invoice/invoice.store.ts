import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { InvoiceState, initialState } from "./invoices.state";
import { combineLatest, tap } from "rxjs";
import { InvoicesService } from "@shared/services";
import { Invoice } from "@shared/models";

@Injectable()
export class InvoiceStore extends ComponentStore<InvoiceState> implements OnDestroy {

    // selectors
    private invoices$ = this.select(state => state.invoices);
    private invoiceFailure$ = this.select(state => state.error);
    private invoiceLoading$ = this.select(state => state.loading);

    // updaters
    readonly setLoading = this.updater((state, loading: boolean) => ({ ...state, loading }));
    readonly setInvoices = this.updater((state, invoices: any) => ({ ...state, invoices }));
    readonly setError = this.updater((state, error: any) => ({ ...state, error }));

    vm$ = combineLatest({
        invoices: this.invoices$,
        error: this.invoiceFailure$,
        loading: this.invoiceLoading$
    });

    constructor(private invoiceService: InvoicesService) {
        super(initialState);
    }

    readonly loadInvoices = this.effect(() => {
        return this.invoiceService.getInvoices().pipe(
            tap(() => this.setLoading(true)),
            tapResponse(
                (invoices: Invoice[]) => {
                    this.setInvoices(invoices);
                    this.setLoading(false);
                },
                (error) => {
                    this.setError(error);
                    this.setLoading(false);
                }
            )
        );
    });

    override ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}