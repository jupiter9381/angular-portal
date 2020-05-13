const mongoose = require('mongoose');
const permissionSchema = mongoose.Schema({
    id: Number,
    title: String,
    level: Number,
    parentId: Number,
    isSelected: Boolean,
    name: String,
    _children: Object
});

const Permission = mongoose.model('Permission', permissionSchema);
module.exports = {Permission};