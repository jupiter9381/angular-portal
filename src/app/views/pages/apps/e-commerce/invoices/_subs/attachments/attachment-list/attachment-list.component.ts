import { Pipe } from '@angular/core';
// Angular
import { Component, OnInit, ElementRef, ViewChild, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
// Material
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort'; 
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
// RXJS
import { debounceTime, distinctUntilChanged, tap, delay } from 'rxjs/operators';
import { fromEvent, merge, BehaviorSubject, Subscription, Observable, of } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from '../../../../../../../../core/reducers';

import {saveAs} from 'file-saver';
// CRUD
import { QueryParamsModel, LayoutUtilsService, MessageType } from '../../../../../../../../core/_base/crud';
// Services and models
import {
	InvoiceAttachmentModel,
	InvoiceAttachmentsDataSource,
	InvoiceAttachmentsPageRequested,
	OneInvoiceAttachmentDeleted,
	ManyInvoiceAttachmentsDeleted,
	InvoiceAttachmentUpdated,
	InvoiceAttachmentOnServerCreated,
	selectLastCreatedInvoiceAttachmentId,
	InvoiceAttachmentsService
} from '../../../../../../../../core/e-commerce';
// Components
import { AttachmentEditDialogComponent } from '../attachment-edit/attachment-edit-dialog.component';

// Table with EDIT item in new page
// ARTICLE for table with sort/filter/paginator
// https://blog.angular-university.io/angular-material-data-table/
// https://v5.material.angular.io/components/table/overview
// https://v5.material.angular.io/components/sort/overview
// https://v5.material.angular.io/components/table/overview#sorting
// https://www.youtube.com/watch?v=NSt9CI3BXv4
@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-attachment-list',
	templateUrl: './attachment-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttachmentListComponent implements OnInit, OnDestroy {
	// Public properties

	// Incoming data
	@Input() invoiceId$: Observable<number>;
	invoiceId: number;

	// Table fields
	dataSource: InvoiceAttachmentsDataSource;
	displayedColumns = ['file', 'actions'];
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	@ViewChild(MatSort, {static: true}) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
	// Selection
	selection = new SelectionModel<InvoiceAttachmentModel>(true, []);
	invoiceAttachmentsResult: InvoiceAttachmentModel[] = [];

	// Private properties
	private componentSubscriptions: Subscription;

	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState></AppState>
	 * @param dialog: MatDialog
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(private store: Store<AppState>,
		           public dialog: MatDialog,
				   private layoutUtilsService: LayoutUtilsService,
					private invoiceAttachmentsService: InvoiceAttachmentsService
	) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		// If the user changes the sort order, reset back to the first page.
		this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		merge(this.sort.sortChange, this.paginator.page)
			.pipe(
				tap(() => {
					this.loadAttachmentsList();
				})
			)
			.subscribe();

		// Filtration, bind to searchInput
		fromEvent(this.searchInput.nativeElement, 'keyup')
			.pipe(
				debounceTime(150),
				distinctUntilChanged(),
				tap(() => {
					this.paginator.pageIndex = 0;
					this.loadAttachmentsList();
				})
			)
			.subscribe();

		// Init DataSource
		this.dataSource = new InvoiceAttachmentsDataSource(this.store);
		this.dataSource.entitySubject.subscribe(res => this.invoiceAttachmentsResult = res);
		this.invoiceId$.subscribe(res => {
			if (!res) {
				return;
			}

			this.invoiceId = res;
			of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line, just loading imitation
				this.loadAttachmentsList();
			}); // Remove this line, just loading imitation
		});
	}

	/**
	 * On destroy
	 */
	ngOnDestroy() {
		if (this.componentSubscriptions) {
			this.componentSubscriptions.unsubscribe();
		}
	}

	/**
	 * Load Specs List
	 */
	loadAttachmentsList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		// Call request from server
		this.store.dispatch(new InvoiceAttachmentsPageRequested({
			page: queryParams,
			invoiceId: this.invoiceId
		}));
	}

	/**
	 * Retirns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter._specificationName = searchText;
		filter.value = searchText;
		return filter;
	}

	/**
	 * Check all rows are selected
	 */
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.invoiceAttachmentsResult.length;
		return numSelected === numRows;
	}

	/**
	 * Selects all rows if they are not all selected; otherwise clear selection
	 */
	masterToggle() {
		if (this.isAllSelected()) {
			this.selection.clear();
		} else {
			this.invoiceAttachmentsResult.forEach(row => this.selection.select(row));
		}
	}

	/** ACTIONS */
	/**
	 * Delete spec
	 *
	 * @param _item: InvoiceAttachmentModel
	 */
	deleteAttachment(_item: InvoiceAttachmentModel) {
		const _title = 'Specification Delete';
		const _description = 'Are you sure to permanently delete this specification?';
		const _waitDesciption = 'Specification is deleting...';
		const _deleteMessage = `Specification has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneInvoiceAttachmentDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadAttachmentsList();
		});
	}

	/**
	 * Delete specs
	 */
	deleteSpecs() {
		const _title = 'Specifications Delete';
		const _description = 'Are you sure to permanently delete selected specifications?';
		const _waitDesciption = 'Specifications are deleting...';
		const _deleteMessage = 'Selected specifications have been deleted';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			const length = this.selection.selected.length;
			const idsForDeletion: number[] = [];
			for (let i = 0; i < length; i++) {
				idsForDeletion.push(this.selection.selected[i].id);
			}
			this.store.dispatch(new ManyInvoiceAttachmentsDeleted({ ids: idsForDeletion }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.selection.clear();
		});
	}


	/**
	 * Fetch selected specs
	 */
	fetchSpecs() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `${elem.invoiceId}`, id: elem.id
			});
		});
		this.layoutUtilsService.fetchElements(messages);
	}


	/**
	 * Open add spec dialog and save data
	 */
	addAttachment() {
		// tslint:disable-next-line:prefer-const
		let newAttachment = new InvoiceAttachmentModel();
		newAttachment.clear(this.invoiceId);
		const dialogRef = this.dialog.open(AttachmentEditDialogComponent, {
			data: {
				attachmentId: undefined,
				value: '',
				isNew: true
			},
			width: '450px'
		});
		dialogRef.afterClosed().subscribe(res => {
			if (res && res.isUpdated) {
				newAttachment.file = res.value;
				newAttachment.invoiceId = this.invoiceId;
				this.store.dispatch(new InvoiceAttachmentOnServerCreated({ invoiceAttachment: newAttachment }));
				this.componentSubscriptions = this.store.pipe(select(selectLastCreatedInvoiceAttachmentId)).subscribe(result => {
					if (!result) {
						return;
					}

					const saveMessage = `Attachment has been created`;
					this.layoutUtilsService.showActionNotification(saveMessage, MessageType.Create, 10000, true, true);
				});
			}
		});
	}

	/**
	 * Edit add spec dialog ans save data
	 *
	 * @param item: InvoiceAttachmentModel
	 */
	editAttachment(item: InvoiceAttachmentModel) {
		const _item = Object.assign({}, item);
		const dialogRef = this.dialog.open(AttachmentEditDialogComponent, {
			data: {
				attachmentId: _item.invoiceId,
				value: _item.file,
				isNew: false
			},
			width: '450px'
		});
		dialogRef.afterClosed().subscribe(res => {
			if (res && res.isUpdated) {
				_item.file = res.value;

				const updateInvoiceAttachment: Update<InvoiceAttachmentModel> = {
					id: _item.id,
					changes: _item
				};
				this.store.dispatch(new InvoiceAttachmentUpdated({
					partialInvoiceAttachment: updateInvoiceAttachment,
					invoiceAttachment: _item
				}));
				const saveMessage = `Specification has been updated`;
				this.layoutUtilsService.showActionNotification(saveMessage, MessageType.Update, 10000, true, true);
			}
		});
	}

	downloadAttachement(item) {
		let filename = item.file;
		this.invoiceAttachmentsService.downloadAttachment(filename)
			.subscribe(res => {
				saveAs(res, filename);
			});
	}
}
