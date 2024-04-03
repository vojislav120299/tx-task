import { Invoice } from "@shared/models";

export interface InvoiceState {
    invoices: Invoice[];
    error: any;
    loading: boolean;
}

export const initialState: InvoiceState = {
    invoices: [],
    error: null,
    loading: false
};
