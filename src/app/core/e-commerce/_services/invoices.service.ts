// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// RxJS
import { Observable, BehaviorSubject } from 'rxjs';
// CRUD
import { HttpUtilsService, QueryParamsModel, QueryResultsModel } from '../../_base/crud';
// Models
import { InvoiceModel } from '../_models/invoice.model';

//const API_INVOICES_URL = 'http://localhost:8080/' + 'api/invoices';
const API_INVOICES_URL = 'api/invoices';
// Real REST API
@Injectable()
export class InvoicesService {
  lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));

  constructor(private http: HttpClient,
              private httpUtils: HttpUtilsService) {
  }

  // CREATE =>  POST: add a new invoice to the server
  createInvoice(invoice): Observable<InvoiceModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<InvoiceModel>(API_INVOICES_URL + '/create', invoice, {headers: httpHeaders});
  }

  // READ
  getAllInvoices(): Observable<InvoiceModel[]> {
    return this.http.get<InvoiceModel[]>(API_INVOICES_URL);
  }

  getInvoiceById(invoiceId: number): Observable<InvoiceModel> {
    return this.http.get<InvoiceModel>(API_INVOICES_URL + `/${invoiceId}`);
  }

  // Server should return filtered/sorted result
  findInvoices(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    //const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    //const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url = API_INVOICES_URL + '/find';
    return this.http.post<QueryResultsModel>(url, queryParams, {
      headers: httpHeaders
    });
  }

  // UPDATE => PUT: update the invoice on the server
  updateInvoice(invoice: InvoiceModel): Observable<any> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.put(API_INVOICES_URL, invoice, {headers: httpHeaders});
  }

  // UPDATE Status
  // Comment this when you start work with real server
  // This code imitates server calls
  updateStatusForInvoice(invoices: InvoiceModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      invoicesForUpdate: invoices,
      newStatus: status
    };
    const url = API_INVOICES_URL + '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the product from the server
  deleteInvoice(invoiceId: number): Observable<InvoiceModel> {
    const url = `${API_INVOICES_URL}/${invoiceId}`;
    return this.http.delete<InvoiceModel>(url);
  }

  deleteInvoices(ids: number[] = []): Observable<any> {
    const url = API_INVOICES_URL + '/delete';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {prdocutIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }
}
