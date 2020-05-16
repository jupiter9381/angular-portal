import { BaseModel } from '../../_base/crud';

export class InvoiceAttachmentModel  extends BaseModel {
  id: number;
  invoiceId: number;
  file: string;
  specId: number;

  clear(invoiceId: number) {
    this.id = undefined;
    this.invoiceId = invoiceId;
    this.file = "";
  }
}
