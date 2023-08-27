const mongoose = require('mongoose');

const blackTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    }
},{
    versionKey: false
})

const blackTokenModel = mongoose.model('blackToken', blackTokenSchema);

module.exports = {
    blackTokenModel
}