const mongoose = require('mongoose');
const invoiceSchema = mongoose.Schema({
    id: Number,
    customer: {type: mongoose.Schema.ObjectId, ref: 'User'},
    invoiceNumber: String,
    status: Number,
    amount: Number,
    created_date: String,
    due_date: String,
    paid_date: String
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = {Invoice};