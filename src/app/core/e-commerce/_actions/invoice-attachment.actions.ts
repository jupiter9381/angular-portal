// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { InvoiceAttachmentModel } from '../_models/invoice-attachment.model';

export enum InvoiceAttachmentActionTypes {
  InvoiceAttachmentOnServerCreated = '[Edit InvoiceAttachment Dialog] Invoice Attachment On Server Created',
  InvoiceAttachmentCreated = '[Edit InvoiceAttachment Dialog] Invoice Attachment Created',
  InvoiceAttachmentUpdated = '[Edit SpecificationSpecification Dialog] Invoice Attachment Updated',
  OneInvoiceAttachmentDeleted = '[Invoice Attachment List Page]  One Invoice Attachment Deleted',
  ManyInvoiceAttachmentsDeleted = '[Invoice Attachments List Page] Many Invoice Attachments Deleted',
  InvoiceAttachmentsPageRequested = '[Invoice Attachments List Page] Invoice Attachments Page Requested',
  InvoiceAttachmentsPageLoaded = '[Invoice Attachments API] Invoice Attachments Page Loaded',
  InvoiceAttachmentsPageCancelled = '[Invoice Attachments API] Invoice Attachments Page Cancelled',
  InvoiceAttachmentsPageToggleLoading = '[Invoice Attachments] Invoice Attachments Page Toggle Loading'
}

export class InvoiceAttachmentOnServerCreated implements Action {
  readonly type = InvoiceAttachmentActionTypes.InvoiceAttachmentOnServerCreated;

  constructor(public payload: { invoiceAttachment: InvoiceAttachmentModel }) {
  }
}

export class InvoiceAttachmentCreated implements Action {
  readonly type = InvoiceAttachmentActionTypes.InvoiceAttachmentCreated;

  constructor(public payload: { invoiceAttachment: InvoiceAttachmentModel }) {
  }
}

export class InvoiceAttachmentUpdated implements Action {
  readonly type = InvoiceAttachmentActionTypes.InvoiceAttachmentUpdated;

  constructor(public payload: {
    partialInvoiceAttachment: Update<InvoiceAttachmentModel>, // For State update
    invoiceAttachment: InvoiceAttachmentModel // For Server update (through service)
  }) {
  }
}

export class OneInvoiceAttachmentDeleted implements Action {
  readonly type = InvoiceAttachmentActionTypes.OneInvoiceAttachmentDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyInvoiceAttachmentsDeleted implements Action {
  readonly type = InvoiceAttachmentActionTypes.ManyInvoiceAttachmentsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class InvoiceAttachmentsPageRequested implements Action {
  readonly type = InvoiceAttachmentActionTypes.InvoiceAttachmentsPageRequested;

  constructor(public payload: { page: QueryParamsModel, invoiceId: number }) {
  }
}

export class InvoiceAttachmentsPageLoaded implements Action {
  readonly type = InvoiceAttachmentActionTypes.InvoiceAttachmentsPageLoaded;

  constructor(public payload: { invoiceAttachments: InvoiceAttachmentModel[], totalCount: number }) {
  }
}

export class InvoiceAttachmentsPageCancelled implements Action {
  readonly type = InvoiceAttachmentActionTypes.InvoiceAttachmentsPageCancelled;
}

export class InvoiceAttachmentsPageToggleLoading implements Action {
  readonly type = InvoiceAttachmentActionTypes.InvoiceAttachmentsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type InvoiceAttachmentActions = InvoiceAttachmentOnServerCreated
| InvoiceAttachmentCreated
| InvoiceAttachmentUpdated
| OneInvoiceAttachmentDeleted
| ManyInvoiceAttachmentsDeleted
| InvoiceAttachmentsPageRequested
| InvoiceAttachmentsPageLoaded
| InvoiceAttachmentsPageCancelled
| InvoiceAttachmentsPageToggleLoading;
