// RxJS
import { debounceTime } from 'rxjs/operators';
// NGRX
import { Store, select } from '@ngrx/store';
// CRUD
import { BaseDataSource, QueryResultsModel } from '../../_base/crud';
// State
import { AppState } from '../../reducers';
import {
  selectInvoiceAttachmentsInStore,
  selectInvoiceAttachmentsPageLoading,
  selectPSInvoiceShowInitWaitingMessage
} from '../_selectors/invoice-attachment.selectors';
export class InvoiceAttachmentsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();

    this.store.pipe(
      select(selectInvoiceAttachmentsInStore),
      debounceTime(600)
    ).subscribe((response: QueryResultsModel) => {
      this.entitySubject.next(response.items);
      this.paginatorTotalSubject.next(response.totalCount);
    });

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectPSInvoiceShowInitWaitingMessage)
    );

    this.loading$ = this.store.pipe(select(selectInvoiceAttachmentsPageLoading));
  }
}
