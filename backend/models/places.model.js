const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: String
    },
    location: {
        type: String,
        required: true
    },
    mapHTML: {
        type: String,
        required: true
    },
    facilities: [],
    isAvailable: {
        type: Boolean,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    maxPeople: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    actualprice: {
        type: Number,
        required: true
    }
}, {
    versionKey: false
})

const placeModel = mongoose.model('place', placeSchema);

module.exports = {
    placeModel
}

