const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {type: String, enum: ["explorer", "admin"]},
    booking: []
},{
    versionKey: false
})

const userModel = mongoose.model('user', userSchema);

module.exports = {
    userModel
}

