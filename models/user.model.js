const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    isDoctor: Boolean,
    about: String,
    imgUrl: String,
    interests: [String]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);