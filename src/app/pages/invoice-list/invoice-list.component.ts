import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { InvoiceStore } from '@shared/store/invoice/invoice.store';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTableModule,
  ],
  providers: [InvoiceStore],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss'
})
export class InvoiceListComponent implements OnInit {

  vm$ = this.invoiceStore.vm$;

  columns = ['id', 'jobAdId', 'amount', 'dueDate'];

  constructor(private invoiceStore: InvoiceStore) {}

  ngOnInit() {
    this.invoiceStore.loadInvoices();
  }
}
