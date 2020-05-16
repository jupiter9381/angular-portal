// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { InvoiceAttachmentsState } from '../_reducers/invoice-attachment.reducers';
import { InvoiceAttachmentModel } from '../_models/invoice-attachment.model';

export const selectInvoiceAttachmentsState = createFeatureSelector<InvoiceAttachmentsState>('invoiceAttachments');

export const selectInvoiceAttachmentById = (invoiceAttachmentId: number) => createSelector(
    selectInvoiceAttachmentsState,
    invoiceAttachmentsState => invoiceAttachmentsState.entities[invoiceAttachmentId]
);

export const selectInvoiceAttachmentsPageLoading = createSelector(
    selectInvoiceAttachmentsState,
    invoiceAttachmentsState => invoiceAttachmentsState.loading
);

export const selectCurrentProductIdInStoreForProductSpecs = createSelector(
    selectInvoiceAttachmentsState,
    invoiceAttachmentsState => invoiceAttachmentsState.invoiceId
);

export const selectLastCreatedInvoiceAttachmentId = createSelector(
    selectInvoiceAttachmentsState,
    invoiceAttachmentsState => invoiceAttachmentsState.lastCreatedInvoiceAttachmentId
);

export const selectPSInvoiceShowInitWaitingMessage = createSelector(
    selectInvoiceAttachmentsState,
    invoiceAttachmentsState => invoiceAttachmentsState.showInitWaitingMessage
);

export const selectInvoiceAttachmentsInStore = createSelector(
    selectInvoiceAttachmentsState,
    invoiceAttachmentsState => {
      const items: InvoiceAttachmentModel[] = [];
      each(invoiceAttachmentsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: InvoiceAttachmentModel[] =
        httpExtension.sortArray(items, invoiceAttachmentsState.lastQuery.sortField, invoiceAttachmentsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, invoiceAttachmentsState.totalCount, '');
    }
);

