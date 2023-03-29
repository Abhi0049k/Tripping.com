const mongoose = require('mongoose');

const placesSchema = mongoose.Schema({
    images: [],
    location: String,
    facilities: [],
    day: Number,
    isBooked: Boolean,
    pricing: Number,
    noofpeople: Number,
    discount: Number,
    actualprice: Number    
},{
    versionKey: false
})

const placesModel = mongoose.model('place', placesSchema);

module.exports = {
    placesModel
}