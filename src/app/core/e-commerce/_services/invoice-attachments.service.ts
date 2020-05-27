// Angular
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
// RxJS
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
// CRUD
import { HttpUtilsService, QueryParamsModel, QueryResultsModel } from '../../_base/crud';
// Models and Consts
import { InvoiceAttachmentModel } from '../_models/invoice-attachment.model';
import { SPECIFICATIONS_DICTIONARY } from '../_consts/specification.dictionary';

//const API_INVOICEATTACHMENTS_URL = 'http://localhost:8080/' + 'api/invoiceAttachments';
//const API_URL = "http://localhost:8080";
const API_INVOICEATTACHMENTS_URL = 'api/invoiceAttachments';
const API_URL = '';
// Real REST API
@Injectable()
export class InvoiceAttachmentsService {
  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
  }

  // CREATE =>  POST: add a new product specification to the server
  createInvoiceAttach(invoiceAttach): Observable<InvoiceAttachmentModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<InvoiceAttachmentModel>(API_INVOICEATTACHMENTS_URL + '/create', invoiceAttach, {headers: httpHeaders});
  }

  // READ
  // Server should return filtered specs by productId
  getAllProductSpecsByProductId(invoiceId: number): Observable<InvoiceAttachmentModel[]> {
    const url = API_INVOICEATTACHMENTS_URL + '?productId=' + invoiceId;
    return this.http.get<InvoiceAttachmentModel[]>(url);
  }

  getProductSpecById(productSpecId: number): Observable<InvoiceAttachmentModel> {
    return this.http.get<InvoiceAttachmentModel>(API_INVOICEATTACHMENTS_URL + `/${productSpecId}`);
  }

  // Server should return sorted/filtered specs and merge with items from state
  findInvoiceAttach(queryParams: QueryParamsModel, invoiceId: number): Observable<QueryResultsModel> {
    const url = API_INVOICEATTACHMENTS_URL + '/find/' + invoiceId;
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      state: queryParams
    };
    return this.http.post<QueryResultsModel>(url, body, {headers: httpHeaders});
  }

  // UPDATE => PUT: update the product specification on the server
  updateInvoiceAttach(invoiceAttachment: InvoiceAttachmentModel): Observable<any> {
    return this.http.post(API_INVOICEATTACHMENTS_URL + '/update', invoiceAttachment, {headers: this.httpUtils.getHTTPHeaders()});
  }

  // DELETE => delete the product specification from the server
  deleteInvoiceAttach(productSpecId: number): Observable<any> {
    const url = `${API_INVOICEATTACHMENTS_URL}/${productSpecId}`;
    return this.http.delete<InvoiceAttachmentModel>(url);
  }

  deleteInvoiceAttachments(ids: number[] = []): Observable<any> {
    const url = API_INVOICEATTACHMENTS_URL + '/deleteProductSpecifications';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {productSpecificationIdsForDelete: ids};
    return this.http.put<any>(url, body, {headers: httpHeaders});
  }

  downloadAttachment(filename: string): Observable<any> {
    const url = `${API_URL}/download`;
    return this.http.post(url, {filename: filename}, {responseType: 'blob', headers: this.httpUtils.getHTTPHeaders()});
  }
  getSpecs(): string[] {
    return SPECIFICATIONS_DICTIONARY;
  }
}
