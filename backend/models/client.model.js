const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'book'
    },
    phoneNumber: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    requests: {
        type: String
    }
},{
    versionKey: false
})

const clientModel = mongoose.model('client', clientSchema);

module.exports = {
    clientModel
}
