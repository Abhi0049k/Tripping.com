const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    name: String,
    age: Number,
    email: String,
    checkin: Date,
    checkout: Date, 
    adhaarNo: String,
    placeId: String,
    userId: String
},{
    versionKey: false
})

const bookModel = mongoose.model('book', bookSchema);

module.exports = {
    bookModel
}