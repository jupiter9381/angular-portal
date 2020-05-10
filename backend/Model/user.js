const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    id: Number,
    username: String,
    password: String,
    email: String,
    accessToken: String,
    refreshToken: String,
    fullname: String,
    role_id: {type: mongoose.Schema.ObjectId, ref: 'Role'},
    pic: String,
    occupation: String,
    companyName: String,
    phone: String,
    address: Object
});

const User = mongoose.model('User', userSchema);
module.exports = {User};