// Angular
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Material
import { MatDialog } from '@angular/material/dialog';
// RxJS
import { Observable, BehaviorSubject, Subscription, of } from 'rxjs';
import { map, startWith, delay, first } from 'rxjs/operators';
// NGRX
import { Store, select } from '@ngrx/store';
import { Dictionary, Update } from '@ngrx/entity';
import { AppState } from '../../../../../../core/reducers';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../../../core/_base/layout';
// CRUD
import { LayoutUtilsService, TypesUtilsService, MessageType } from '../../../../../../core/_base/crud';
// Services and Models
import {
	selectLastCreatedInvoiceId,
	selectInvoiceById,
	SPECIFICATIONS_DICTIONARY,
	InvoiceModel,
	InvoiceOnServerCreated,
	InvoiceUpdated,
	InvoicesService
} from '../../../../../../core/e-commerce';

const AVAILABLE_COLORS: string[] =
	['Red', 'CadetBlue', 'Gold', 'LightSlateGrey', 'RoyalBlue', 'Crimson', 'Blue', 'Sienna', 'Indigo', 'Green', 'Violet',
		'GoldenRod', 'OrangeRed', 'Khaki', 'Teal', 'Purple', 'Orange', 'Pink', 'Black', 'DarkTurquoise'];

const AVAILABLE_MANUFACTURES: string[] =
	['Pontiac', 'Subaru', 'Mitsubishi', 'Oldsmobile', 'Chevrolet', 'Chrysler', 'Suzuki', 'GMC', 'Cadillac', 'Mercury', 'Dodge',
		'Ram', 'Lexus', 'Lamborghini', 'Honda', 'Nissan', 'Ford', 'Hyundai', 'Saab', 'Toyota'];

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-invoice-edit',
	templateUrl: './invoice-edit.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceEditComponent implements OnInit, OnDestroy {
	// Public properties
	invoice: InvoiceModel;
	invoiceId$: Observable<number>;
	oldInvoice: InvoiceModel;
	selectedTab = 0;
	loadingSubject = new BehaviorSubject<boolean>(true);
	loading$: Observable<boolean>;
	invoiceForm: FormGroup;
	hasFormErrors = false;
	filteredColors: Observable<string[]>;
	filteredManufactures: Observable<string[]>;
	// Private password
	private componentSubscriptions: Subscription;
	// sticky portlet header margin
	private headerMargin: number;

	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param typesUtilsService: TypesUtilsService
	 * @param invoiceFB: FormBuilder
	 * @param dialog: MatDialog
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: SubheaderService
	 * @param layoutConfigService: LayoutConfigService
	 * @param invoiceService: InvoicesService
	 * @param cdr: ChangeDetectorRef
	 */
	constructor(
		private store: Store<AppState>,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private typesUtilsService: TypesUtilsService,
		private invoiceFB: FormBuilder,
		public dialog: MatDialog,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private layoutConfigService: LayoutConfigService,
		private invoiceService: InvoicesService,
		private cdr: ChangeDetectorRef) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id && id > 0) {

				this.store.pipe(
					select(selectInvoiceById(id))
				).subscribe(result => {
					if (!result) {
						this.loadInvoiceFromService(id);
						return;
					}

					this.loadInvoice(result);
				});
			} else {
				const newInvoice = new InvoiceModel();
				newInvoice.clear();
				this.loadInvoice(newInvoice);
			}
		});	

		// sticky portlet header
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
	}

	loadInvoice(_invoice, fromService: boolean = false) {
		if (!_invoice) {
			this.goBack('');
		}
		this.invoice = _invoice;
		this.invoiceId$ = of(_invoice.id);
		this.oldInvoice = Object.assign({}, _invoice);
		this.initInvoice();
		if (fromService) {
			this.cdr.detectChanges();
		}
	}

	// If invoice didn't find in store
	loadInvoiceFromService(invoiceId) {
		this.invoiceService.getInvoiceById(invoiceId).subscribe(res => {
			this.loadInvoice(res, true);
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
	 * Init invoice
	 */
	initInvoice() {
		this.createForm();
		this.loadingSubject.next(false);
		if (!this.invoice.id) {
			this.subheaderService.setBreadcrumbs([
				{ title: 'eCommerce', page: `/ecommerce` },
				{ title: 'Invoices', page: `/ecommerce/invoices` },
				{ title: 'Create invoice', page: `/ecommerce/invoices/add` }
			]);
			return;
		}
		this.subheaderService.setTitle('Edit invoice');
		this.subheaderService.setBreadcrumbs([
			{ title: 'eCommerce', page: `/ecommerce` },
			{ title: 'Invoices', page: `/ecommerce/invoices` },
			{ title: 'Edit invoice', page: `/ecommerce/invoices/edit`, queryParams: { id: this.invoice.id } }
		]);
	}

	/**
	 * Create form
	 */
	createForm() {
		this.invoiceForm = this.invoiceFB.group({
			customer: [this.invoice.customer, Validators.required],
			amount: [this.invoice.amount, Validators.required],
			created_date: [this.invoice.created_date, Validators.required],
			due_date: [this.invoice.due_date, Validators.required]
		});
	}

	/**
	 * Filter manufacture
	 *
	 * @param val: string
	 */
	filterManufacture(val: string): string[] {
		return AVAILABLE_MANUFACTURES.filter(option =>
			option.toLowerCase().includes(val.toLowerCase()));
	}

	/**
	 * Filter color
	 *
	 * @param val: string
	 */
	filterColor(val: string): string[] {
		return AVAILABLE_COLORS.filter(option =>
			option.toLowerCase().includes(val.toLowerCase()));
	}

	/**
	 * Go back to the list
	 *
	 * @param id: any
	 */
	goBack(id) {
		this.loadingSubject.next(false);
		const url = `/ecommerce/invoices?id=${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	goBackWithoutId() {
		this.router.navigateByUrl('/ecommerce/invoices', { relativeTo: this.activatedRoute });
	}

	/**
	 * Refresh invoice
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshInvoice(isNew: boolean = false, id = 0) {
		this.loadingSubject.next(false);
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/ecommerce/invoices/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	/**
	 * Reset
	 */
	reset() {
		this.invoice = Object.assign({}, this.oldInvoice);
		this.createForm();
		this.hasFormErrors = false;
		this.invoiceForm.markAsPristine();
		this.invoiceForm.markAsUntouched();
		this.invoiceForm.updateValueAndValidity();
	}

	/**
	 * Save data
	 *
	 * @param withBack: boolean
	 */
	onSumbit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.invoiceForm.controls;
		/** check form */
		if (this.invoiceForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		// tslint:disable-next-line:prefer-const
		let editedInvoice = this.prepareInvoice();

		if (editedInvoice.id > 0) {
			this.updateInvoice(editedInvoice, withBack);
			return;
		}

		this.addInvoice(editedInvoice, withBack);
	}

	/**
	 * Returns object for saving
	 */
	prepareInvoice(): InvoiceModel {
		const controls = this.invoiceForm.controls;
		const _invoice = new InvoiceModel();
		_invoice.id = this.invoice.id;
		_invoice.customer = controls.customer.value;
		_invoice.amount = controls.amount.value;
		_invoice.created_date = controls.created_date.value;
		_invoice.due_date = controls.due_date.value;
		return _invoice;
	}

	/**
	 * Add invoice
	 *
	 * @param _invoice: InvoiceModel
	 * @param withBack: boolean
	 */
	addInvoice(_invoice: InvoiceModel, withBack: boolean = false) {
		this.loadingSubject.next(true);
		console.log(_invoice);
		this.store.dispatch(new InvoiceOnServerCreated({ invoice: _invoice }));
		this.componentSubscriptions = this.store.pipe(
			delay(1000),
			select(selectLastCreatedInvoiceId)
		).subscribe(newId => {
			if (!newId) {
				return;
			}

			this.loadingSubject.next(false);
			if (withBack) {
				this.goBack(newId);
			} else {
				const message = `New invoice successfully has been added.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.refreshInvoice(true, newId);
			}
		});
	}

	/**
	 * Update invoice
	 *
	 * @param _invoice: InvoiceModel
	 * @param withBack: boolean
	 */
	updateInvoice(_invoice: InvoiceModel, withBack: boolean = false) {
		this.loadingSubject.next(true);

		const updateInvoice: Update<InvoiceModel> = {
			id: _invoice.id,
			changes: _invoice
		};

		this.store.dispatch(new InvoiceUpdated({
			partialInvoice: updateInvoice,
			invoice: _invoice
		}));

		of(undefined).pipe(delay(3000)).subscribe(() => { // Remove this line
			if (withBack) {
				this.goBack(_invoice.id);
			} else {
				const message = `Invoice successfully has been saved.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 10000, true, true);
				this.refreshInvoice(false);
			}
		}); // Remove this line
	}

	/**
	 * Returns component title
	 */
	getComponentTitle() {
		let result = 'Create invoice';
		if (!this.invoice || !this.invoice.id) {
			return result;
		}

		result = `Edit invoice - ${this.invoice.customer} `;
		return result;
	}

	/**
	 * Close alert
	 *
	 * @param $event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}
}
