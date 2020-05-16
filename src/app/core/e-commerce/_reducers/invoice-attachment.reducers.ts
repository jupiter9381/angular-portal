// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { InvoiceAttachmentActions, InvoiceAttachmentActionTypes } from '../_actions/invoice-attachment.actions';
// Models
import { InvoiceAttachmentModel } from '../_models/invoice-attachment.model';
import { QueryParamsModel } from '../../_base/crud';

export interface InvoiceAttachmentsState extends EntityState<InvoiceAttachmentModel> {
  invoiceId: number;
  loading: boolean;
  totalCount: number;
  lastCreatedInvoiceAttachmentId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<InvoiceAttachmentModel> = createEntityAdapter<InvoiceAttachmentModel>();

export const initialInvoiceAttachmentsState: InvoiceAttachmentsState = adapter.getInitialState({
  loading: false,
  totalCount: 0,
  invoiceId: undefined,
  lastCreatedInvoiceAttachmentId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function invoiceAttachmentsReducer(state = initialInvoiceAttachmentsState,
                                             action: InvoiceAttachmentActions): InvoiceAttachmentsState {
  switch (action.type) {
    case InvoiceAttachmentActionTypes.InvoiceAttachmentsPageToggleLoading:
      return {
        ...state,
        loading: action.payload.isLoading,
        lastCreatedInvoiceAttachmentId: undefined
      };
    case InvoiceAttachmentActionTypes.InvoiceAttachmentOnServerCreated:
      return {...state, loading: true};
    case InvoiceAttachmentActionTypes.InvoiceAttachmentCreated:
      return adapter.addOne(action.payload.invoiceAttachment, {
        ...state,
        lastCreatedProductSpecificationId: action.payload.invoiceAttachment.id
      });
    case InvoiceAttachmentActionTypes.InvoiceAttachmentUpdated:
      return adapter.updateOne(action.payload.partialInvoiceAttachment, state);
    case InvoiceAttachmentActionTypes.OneInvoiceAttachmentDeleted:
      return adapter.removeOne(action.payload.id, state);
    case InvoiceAttachmentActionTypes.ManyInvoiceAttachmentsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case InvoiceAttachmentActionTypes.InvoiceAttachmentsPageCancelled:
      return {...state, totalCount: 0, loading: false, invoiceId: undefined, lastQuery: new QueryParamsModel({})};
    case InvoiceAttachmentActionTypes.InvoiceAttachmentsPageRequested:
      return {
        ...state,
        totalCount: 0,
        loading: true,
        invoiceId: action.payload.invoiceId,
        lastQuery: action.payload.page
      };
    case InvoiceAttachmentActionTypes.InvoiceAttachmentsPageLoaded:
      return adapter.addMany(action.payload.invoiceAttachments, {
        ...initialInvoiceAttachmentsState,
        totalCount: action.payload.totalCount,
        loading: false,
        invoiceId: state.invoiceId,
        lastQuery: state.lastQuery,
        showInitWaitingMessage: false
      });
    default:
      return state;
  }
}

export const getInvoiceAttachmentsState = createFeatureSelector<InvoiceAttachmentModel>('invoiceAttachments');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
