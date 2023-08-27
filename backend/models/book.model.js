const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    days: {
        type:Number,
        required: true
    },
    totalCost: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'complete'],
        default: 'pending'
    },
    placeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'place'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
},{
    versionKey: false
})

const bookModel = mongoose.model('book', bookSchema);

module.exports = {
    bookModel
}