const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["explorer", "admin", "propertyOwner"],
        default: 'explorer'
    }
}, {
    versionKey: false
})

const userModel = mongoose.model('user', userSchema);

module.exports = {
    userModel
}

