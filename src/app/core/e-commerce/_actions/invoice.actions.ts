// NGRX
import { Action } from '@ngrx/store';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { InvoiceModel } from '../_models/invoice.model';
import { Update } from '@ngrx/entity';

export enum InvoiceActionTypes {
  InvoiceOnServerCreated = '[Edit Invoice Component] Invoice On Server Created',
  InvoiceCreated = '[Edit Invoice Component] Invoice Created',
  InvoiceUpdated = '[Edit Invoice Component] Invoice Updated',
  InvoicesStatusUpdated = '[Invoices List Page] Invoices Status Updated',
  OneInvoiceDeleted = '[Invoices List Page] One Invoice Deleted',
  ManyInvoicesDeleted = '[Invoices List Page] Many Selected Invoices Deleted',
  InvoicesPageRequested = '[Invoices List Page] Invoices Page Requested',
  InvoicesPageLoaded = '[Invoices API] Invoices Page Loaded',
  InvoicesPageCancelled = '[Invoices API] Invoices Page Cancelled',
  InvoicesPageToggleLoading = '[Invoices] Invoices Page Toggle Loading',
  InvoicesActionToggleLoading = '[Invoices] Invoices Action Toggle Loading'
}

export class InvoiceOnServerCreated implements Action {
  readonly type = InvoiceActionTypes.InvoiceOnServerCreated;

  constructor(public payload: { invoice: InvoiceModel }) {
  }
}

export class InvoiceCreated implements Action {
  readonly type = InvoiceActionTypes.InvoiceCreated;

  constructor(public payload: { invoice: InvoiceModel }) {
  }
}

export class InvoiceUpdated implements Action {
  readonly type = InvoiceActionTypes.InvoiceUpdated;

  constructor(public payload: {
    partialInvoice: Update<InvoiceModel>, // For State update
    invoice: InvoiceModel // For Server update (through service)
  }) {
  }
}

export class InvoicesStatusUpdated implements Action {
  readonly type = InvoiceActionTypes.InvoicesStatusUpdated;

  constructor(public payload: {
    invoices: InvoiceModel[],
    status: number
  }) {
  }
}

export class OneInvoiceDeleted implements Action {
  readonly type = InvoiceActionTypes.OneInvoiceDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyInvoicesDeleted implements Action {
  readonly type = InvoiceActionTypes.ManyInvoicesDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class InvoicesPageRequested implements Action {
  readonly type = InvoiceActionTypes.InvoicesPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class InvoicesPageLoaded implements Action {
  readonly type = InvoiceActionTypes.InvoicesPageLoaded;

  constructor(public payload: { invoices: InvoiceModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class InvoicesPageCancelled implements Action {
  readonly type = InvoiceActionTypes.InvoicesPageCancelled;
}

export class InvoicesPageToggleLoading implements Action {
  readonly type = InvoiceActionTypes.InvoicesPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class InvoicesActionToggleLoading implements Action {
  readonly type = InvoiceActionTypes.InvoicesActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type InvoiceActions = InvoiceOnServerCreated
| InvoiceCreated
| InvoiceUpdated
| InvoicesStatusUpdated
| OneInvoiceDeleted
| ManyInvoicesDeleted
| InvoicesPageRequested
| InvoicesPageLoaded
| InvoicesPageCancelled
| InvoicesPageToggleLoading
| InvoicesActionToggleLoading;
