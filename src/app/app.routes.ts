import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'jobAds',
        pathMatch: 'full'
    },
    {
        path: 'jobAds',
        loadComponent: () => import('./pages/job-ad-list/job-ad-list.component').then(m => m.JobAdListComponent)
    },
    {
        path: 'invoices',
        loadComponent: () => import('./pages/invoice-list/invoice-list.component').then(m => m.InvoiceListComponent)
    }
];
