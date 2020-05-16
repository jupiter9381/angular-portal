const mongoose = require('mongoose');
const attachmentSchema = mongoose.Schema({
    id: Number,
    invoiceid: Number,
    file: String
});

const Attachment = mongoose.model('Attachment', attachmentSchema);
module.exports = {Attachment};