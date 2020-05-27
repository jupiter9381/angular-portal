const mongoose = require('mongoose');
const attachmentSchema = mongoose.Schema({
    id: Number,
    invoiceId: Number,
    file: String
});

const Attachment = mongoose.model('Attachment', attachmentSchema);
module.exports = {Attachment};