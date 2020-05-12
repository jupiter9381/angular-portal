import { BaseModel } from '../../_base/crud';
//import { ProductSpecificationModel } from './product-specification.model';
//import { ProductRemarkModel } from './product-remark.model';

export class InvoiceModel extends BaseModel {
  id: number;
  customer: string;
  amount: number;
  model: string;
  manufacture: string;
  modelYear: number;
  mileage: number;
  description: string;
  color: string;
  price: number;
  condition: number;
  status: number;
  VINCode: string;

  // tslint:disable-next-line
  //_specs: ProductSpecificationModel[];
  // tslint:disable-next-line
  //_remarks: ProductRemarkModel[];

  clear() {
    this.customer = '';
    this.model = '';
    this.amount = 0;
    this.manufacture = '';
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
