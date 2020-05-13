const mongoose = require('mongoose');
const roleSchema = mongoose.Schema({
    id: Number,
    title: String,
    isCoreRole: Boolean,
    permissions: Array
});

const Role = mongoose.model('Role', roleSchema);
module.exports = {Role};