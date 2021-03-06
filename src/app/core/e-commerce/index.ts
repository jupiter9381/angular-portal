// Context
export { ECommerceDataContext } from './_server/_e-commerce.data-context';

// Models and Consts
export { CustomerModel } from './_models/customer.model';
export { ProductRemarkModel } from './_models/product-remark.model';
export { ProductSpecificationModel } from './_models/product-specification.model';
export { ProductModel } from './_models/product.model';
export { InvoiceModel } from './_models/invoice.model';
export { InvoiceAttachmentModel } from './_models/invoice-attachment.model';

export { SPECIFICATIONS_DICTIONARY } from './_consts/specification.dictionary';

// DataSources
export { CustomersDataSource } from './_data-sources/customers.datasource';
export { ProductRemarksDataSource } from './_data-sources/product-remarks.datasource';
export { ProductSpecificationsDataSource } from './_data-sources/product-specifications.datasource';
export { ProductsDataSource } from './_data-sources/products.datasource';
export { InvoicesDataSource } from './_data-sources/invoices.datasource';
export { InvoiceAttachmentsDataSource } from './_data-sources/invoice-attachments.datasource';
// Actions
// Customer Actions =>
export {
    CustomerActionTypes,
    CustomerActions,
    CustomerOnServerCreated,
    CustomerCreated,
    CustomerUpdated,
    CustomersStatusUpdated,
    OneCustomerDeleted,
    ManyCustomersDeleted,
    CustomersPageRequested,
    CustomersPageLoaded,
    CustomersPageCancelled,
    CustomersPageToggleLoading
} from './_actions/customer.actions';
// Product actions =>
export {
    ProductActionTypes,
    ProductActions,
    ProductOnServerCreated,
    ProductCreated,
    ProductUpdated,
    ProductsStatusUpdated,
    OneProductDeleted,
    ManyProductsDeleted,
    ProductsPageRequested,
    ProductsPageLoaded,
    ProductsPageCancelled,
    ProductsPageToggleLoading,
    ProductsActionToggleLoading
} from './_actions/product.actions';

// Invoice actions =>
export {
    InvoiceActionTypes,
    InvoiceActions,
    InvoiceOnServerCreated,
    InvoiceCreated,
    InvoiceUpdated,
    InvoicesStatusUpdated,
    OneInvoiceDeleted,
    ManyInvoicesDeleted,
    InvoicesPageRequested,
    InvoicesPageLoaded,
    InvoicesPageCancelled,
    InvoicesPageToggleLoading,
    InvoicesActionToggleLoading
} from './_actions/invoice.actions';


// ProductRemark Actions =>
export {
    ProductRemarkActionTypes,
    ProductRemarkActions,
    ProductRemarkCreated,
    ProductRemarkUpdated,
    ProductRemarkStoreUpdated,
    OneProductRemarkDeleted,
    ManyProductRemarksDeleted,
    ProductRemarksPageRequested,
    ProductRemarksPageLoaded,
    ProductRemarksPageCancelled,
    ProductRemarksPageToggleLoading,
    ProductRemarkOnServerCreated
} from './_actions/product-remark.actions';
// ProductSpecification Actions =>
export {
    ProductSpecificationActionTypes,
    ProductSpecificationActions,
    ProductSpecificationCreated,
    ProductSpecificationUpdated,
    OneProductSpecificationDeleted,
    ManyProductSpecificationsDeleted,
    ProductSpecificationsPageRequested,
    ProductSpecificationsPageLoaded,
    ProductSpecificationsPageCancelled,
    ProductSpecificationsPageToggleLoading,
    ProductSpecificationOnServerCreated
} from './_actions/product-specification.actions';

// ProductSpecification Actions =>
export {
    InvoiceAttachmentActionTypes,
    InvoiceAttachmentActions,
    InvoiceAttachmentCreated,
    InvoiceAttachmentUpdated,
    OneInvoiceAttachmentDeleted,
    ManyInvoiceAttachmentsDeleted,
    InvoiceAttachmentsPageRequested,
    InvoiceAttachmentsPageLoaded,
    InvoiceAttachmentsPageCancelled,
    InvoiceAttachmentsPageToggleLoading,
    InvoiceAttachmentOnServerCreated
} from './_actions/invoice-attachment.actions';

// Effects
export { CustomerEffects } from './_effects/customer.effects';
export { ProductEffects } from './_effects/product.effects';
export { InvoiceEffects } from './_effects/invoice.effects';
export { ProductRemarkEffects } from './_effects/product-remark.effects';
export { ProductSpecificationEffects } from './_effects/product-specification.effects';
export { InvoiceAttachmentEffects } from './_effects/invoice-attachment.effects';

// Reducers
export { customersReducer } from './_reducers/customer.reducers';
export { productsReducer } from './_reducers/product.reducers';
export { invoicesReducer } from './_reducers/invoice.reducers';
export { productRemarksReducer } from './_reducers/product-remark.reducers';
export { productSpecificationsReducer } from './_reducers/product-specification.reducers';
export { invoiceAttachmentsReducer } from './_reducers/invoice-attachment.reducers';
// Selectors
// Customer selectors =>
export {
    selectCustomerById,
    selectCustomersInStore,
    selectCustomersPageLoading,
    selectLastCreatedCustomerId,
    selectCustomersActionLoading,
    selectCustomersShowInitWaitingMessage
} from './_selectors/customer.selectors';
// Product selectors
export {
    selectProductById,
    selectProductsInStore,
    selectProductsPageLoading,
    selectProductsPageLastQuery,
    selectLastCreatedProductId,
    selectHasProductsInStore,
    selectProductsActionLoading,
    selectProductsInitWaitingMessage,
} from './_selectors/product.selectors';

// Invoice selectors
export {
    selectInvoiceById,
    selectInvoicesInStore,
    selectInvoicesPageLoading,
    selectInvoicesPageLastQuery,
    selectLastCreatedInvoiceId,
    selectHasInvoicesInStore,
    selectInvoicesActionLoading,
    selectInvoicesInitWaitingMessage,
} from './_selectors/invoice.selectors';

// ProductRemark selectors =>
export {
    selectProductRemarkById,
    selectProductRemarksInStore,
    selectProductRemarksPageLoading,
    selectCurrentProductIdInStoreForProductRemarks,
    selectLastCreatedProductRemarkId,
    selectPRShowInitWaitingMessage
} from './_selectors/product-remark.selectors';
// ProductSpecification selectors =>
export {
    selectProductSpecificationById,
    selectProductSpecificationsInStore,
    selectProductSpecificationsPageLoading,
    selectCurrentProductIdInStoreForProductSpecs,
    selectProductSpecificationsState,
    selectLastCreatedProductSpecificationId,
    selectPSShowInitWaitingMessage
} from './_selectors/product-specification.selectors';

// InvoiceAttachment selectors =>
export {
    selectInvoiceAttachmentById,
    selectInvoiceAttachmentsInStore,
    selectInvoiceAttachmentsPageLoading,
    //selectCurrentProductIdInStoreForProductSpecs,
    selectInvoiceAttachmentsState,
    selectLastCreatedInvoiceAttachmentId,
    selectPSInvoiceShowInitWaitingMessage
} from './_selectors/invoice-attachment.selectors';

// Services
export { CustomersService } from './_services/';
export { ProductsService } from './_services/';
export { ProductRemarksService } from './_services/';
export { ProductSpecificationsService } from './_services/';
export { InvoicesService } from './_services/';
export { InvoiceAttachmentsService } from './_services/';
