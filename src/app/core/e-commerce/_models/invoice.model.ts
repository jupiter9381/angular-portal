import { BaseModel } from '../../_base/crud';
//import { ProductSpecificationModel } from './product-specification.model';
//import { ProductRemarkModel } from './product-remark.model';

export class InvoiceModel extends BaseModel {
  id: number;
  customer: string;
  amount: number;
  created_date: Date;
  due_date: Date;
  paid_date: Date;
  invoiceNumber: string;
  status: number;
  modelYear: number;
  mileage: number;
  description: string;
  color: string;
  price: number;
  condition: number;
  VINCode: string;

  // tslint:disable-next-line
  //_specs: ProductSpecificationModel[];
  // tslint:disable-next-line
  //_remarks: ProductRemarkModel[];

  clear() {
    this.customer = '';
    this.created_date = null;
    this.due_date = null;
    this.paid_date = null;
    this.amount = 0;
    this.invoiceNumber = '';
    this.modelYear = 2000;
    this.mileage = 0;
    this.description = '';
    this.color = 'Black';
    this.price = 1000;
    this.condition = 0;
    this.status = 0;
    this.VINCode = '';
  }
}
