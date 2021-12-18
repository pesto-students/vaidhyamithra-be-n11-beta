const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    isDoctor: Boolean
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);