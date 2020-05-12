const mongoose = require('mongoose');
const invoiceSchema = mongoose.Schema({
    id: Number,
    customer: String,
    amount: Number,
    created_date: String,
    due_date: String
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = {Invoice};