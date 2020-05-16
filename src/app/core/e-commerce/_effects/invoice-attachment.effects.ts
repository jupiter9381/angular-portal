// Angular
import { Injectable } from '@angular/core';
// RxJS
import { of } from 'rxjs';
import { mergeMap, map, catchError, tap } from 'rxjs/operators';
// NGRX
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
// CRUD
import { QueryResultsModel } from '../../_base/crud';
// Services
import { InvoiceAttachmentsService } from '../_services/';
// State
import { AppState } from '../../../core/reducers';
// Actions
import {
    InvoiceAttachmentActionTypes,
    InvoiceAttachmentsPageRequested,
    InvoiceAttachmentsPageLoaded,
    ManyInvoiceAttachmentsDeleted,
    OneInvoiceAttachmentDeleted,
    InvoiceAttachmentsPageToggleLoading,
    InvoiceAttachmentUpdated,
    InvoiceAttachmentCreated,
    InvoiceAttachmentOnServerCreated
} from '../_actions/invoice-attachment.actions';

@Injectable()
export class InvoiceAttachmentEffects {
  // showLoadingDistpatcher = new InvoiceAttachmentsPageToggleLoading({ isLoading: true });
  hideLoadingDistpatcher = new InvoiceAttachmentsPageToggleLoading({isLoading: false});

  @Effect()
  loadInvoiceAttachmentsPage$ = this.actions$
    .pipe(
      ofType<InvoiceAttachmentsPageRequested>(InvoiceAttachmentActionTypes.InvoiceAttachmentsPageRequested),
      mergeMap(({payload}) => this.invoiceAttachmentsService.findInvoiceAttach(payload.page, payload.invoiceId)),
      map((result: QueryResultsModel) => {
        return new InvoiceAttachmentsPageLoaded({
          invoiceAttachments: result.items,
          totalCount: result.totalCount
        });
      }),
    );

  @Effect()
  deleteInvoiceAttachment$ = this.actions$
    .pipe(
      ofType<OneInvoiceAttachmentDeleted>(InvoiceAttachmentActionTypes.OneInvoiceAttachmentDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(new InvoiceAttachmentsPageToggleLoading({isLoading: true}));
          return this.invoiceAttachmentsService.deleteInvoiceAttach(payload.id);
        }
      ),
      map(() => {
        return this.hideLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteInvoiceAttachments$ = this.actions$
    .pipe(
      ofType<ManyInvoiceAttachmentsDeleted>(InvoiceAttachmentActionTypes.ManyInvoiceAttachmentsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(new InvoiceAttachmentsPageToggleLoading({isLoading: true}));
          return this.invoiceAttachmentsService.deleteInvoiceAttachments(payload.ids);
        }
      ),
      map(() => {
        return this.hideLoadingDistpatcher;
      }),
    );

  @Effect()
  updateInvoiceAttachment$ = this.actions$
    .pipe(
      ofType<InvoiceAttachmentUpdated>(InvoiceAttachmentActionTypes.InvoiceAttachmentUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(new InvoiceAttachmentsPageToggleLoading({isLoading: true}));
        return this.invoiceAttachmentsService.updateInvoiceAttach(payload.invoiceAttachment);
      }),
      map(() => {
        return this.hideLoadingDistpatcher;
      }),
    );

  @Effect()
  createInvoiceAttachment$ = this.actions$
    .pipe(
      ofType<InvoiceAttachmentOnServerCreated>(InvoiceAttachmentActionTypes.InvoiceAttachmentOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(new InvoiceAttachmentsPageToggleLoading({isLoading: true}));
        return this.invoiceAttachmentsService.createInvoiceAttach(payload.invoiceAttachment).pipe(
          tap(res => {
            this.store.dispatch(new InvoiceAttachmentCreated({invoiceAttachment: res}));
          })
        );
      }),
      map(() => {
        return this.hideLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions,
              private invoiceAttachmentsService: InvoiceAttachmentsService,
              private store: Store<AppState>) {
  }
}
