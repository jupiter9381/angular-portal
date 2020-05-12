import { forkJoin } from 'rxjs';
// Angular
import { Injectable } from '@angular/core';
// RxJS
import { mergeMap, map, tap } from 'rxjs/operators';
// NGRX
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
// CRUD
import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';
// Services
import { InvoicesService } from '../_services/';
// State
import { AppState } from '../../../core/reducers';
// Actions
import {
    InvoiceActionTypes,
    InvoicesPageRequested,
    InvoicesPageLoaded,
    ManyInvoicesDeleted,
    OneInvoiceDeleted,
    InvoicesPageToggleLoading,
    InvoicesStatusUpdated,
    InvoiceUpdated,
    InvoiceCreated,
    InvoiceOnServerCreated
} from '../_actions/invoice.actions';
import { defer, Observable, of } from 'rxjs';

@Injectable()
export class InvoiceEffects {
  showPageLoadingDistpatcher = new InvoicesPageToggleLoading({isLoading: true});
  showLoadingDistpatcher = new InvoicesPageToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new InvoicesPageToggleLoading({isLoading: false});

  @Effect()
  loadInvoicesPage$ = this.actions$
    .pipe(
      ofType<InvoicesPageRequested>(InvoiceActionTypes.InvoicesPageRequested),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showPageLoadingDistpatcher);
        const requestToServer = this.invoicesService.findInvoices(payload.page);
        const lastQuery = of(payload.page);
        return forkJoin(requestToServer, lastQuery);
      }),
      map(response => {
        const result: QueryResultsModel = response[0];
        const lastQuery: QueryParamsModel = response[1];
        return new InvoicesPageLoaded({
          invoices: result.items,
          totalCount: result.totalCount,
          page: lastQuery
        });
      }),
    );

  @Effect()
  deleteInvoice$ = this.actions$
    .pipe(
      ofType<OneInvoiceDeleted>(InvoiceActionTypes.OneInvoiceDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showLoadingDistpatcher);
          return this.invoicesService.deleteInvoice(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteInvoices$ = this.actions$
    .pipe(
      ofType<ManyInvoicesDeleted>(InvoiceActionTypes.ManyInvoicesDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showLoadingDistpatcher);
          return this.invoicesService.deleteInvoices(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateInvoicesStatus$ = this.actions$
    .pipe(
      ofType<InvoicesStatusUpdated>(InvoiceActionTypes.InvoicesStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showLoadingDistpatcher);
        return this.invoicesService.updateStatusForInvoice(payload.invoices, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateInvoice$ = this.actions$
    .pipe(
      ofType<InvoiceUpdated>(InvoiceActionTypes.InvoiceUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showLoadingDistpatcher);
        return this.invoicesService.updateInvoice(payload.invoice);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  createInvoice$ = this.actions$
    .pipe(
      ofType<InvoiceOnServerCreated>(InvoiceActionTypes.InvoiceOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showLoadingDistpatcher);
        return this.invoicesService.createInvoice(payload.invoice).pipe(
          tap(res => {
            this.store.dispatch(new InvoiceCreated({invoice: res}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  // @Effect()
  // init$: Observable<Action> = defer(() => {
  //     const queryParams = new QueryParamsModel({});
  //     return of(new InvoicesPageRequested({ page: queryParams }));
  // });

  constructor(private actions$: Actions, private invoicesService: InvoicesService, private store: Store<AppState>) {
  }
}
